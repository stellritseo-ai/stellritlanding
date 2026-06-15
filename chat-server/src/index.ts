import http from 'node:http';
import fs from 'node:fs';
import path from 'node:path';

const PORT = Number(process.env.CHAT_SERVER_PORT ?? 3001);
const DB_PATH = path.join(process.cwd(), 'chat-db.json');

// ─── Database Types & Helpers ────────────────────────────────────────────────
interface DbSession {
  id: string;
  visitorId: string;
  visitorName: string;
  visitorPhoneOrEmail: string;
  status: 'open' | 'closed';
  createdAt: string;
  updatedAt: string;
}

interface DbMessage {
  id: string;
  sessionId: string;
  senderType: 'visitor' | 'admin';
  message: string;
  createdAt: string;
  readAt: string | null;
}

interface DbSchema {
  sessions: DbSession[];
  messages: DbMessage[];
}

function readDb(): DbSchema {
  try {
    if (!fs.existsSync(DB_PATH)) {
      return { sessions: [], messages: [] };
    }
    const data = fs.readFileSync(DB_PATH, 'utf-8');
    return JSON.parse(data) as DbSchema;
  } catch (err) {
    console.error('Error reading db:', err);
    return { sessions: [], messages: [] };
  }
}

function writeDb(db: DbSchema): void {
  try {
    fs.writeFileSync(DB_PATH, JSON.stringify(db, null, 2), 'utf-8');
  } catch (err) {
    console.error('Error writing db:', err);
  }
}

// ─── Sanitization helper ──────────────────────────────────────────────────────
function sanitize(text: string): string {
  return text
    .replace(/<[^>]*>/g, '')
    .replace(/javascript:/gi, '')
    .trim()
    .slice(0, 2000);
}

// ─── SSE client management ────────────────────────────────────────────────────
interface SseClient {
  res: http.ServerResponse;
  role: 'visitor' | 'admin';
  sessionId?: string;
}

const sseClients: SseClient[] = [];

function broadcast(event: { type: string; data: any }, sessionId?: string) {
  const payload = `data: ${JSON.stringify(event)}\n\n`;
  sseClients.forEach((client) => {
    if (client.role === 'admin') {
      client.res.write(payload);
    } else if (client.role === 'visitor' && client.sessionId === sessionId) {
      client.res.write(payload);
    }
  });
}

// ─── Request helper ───────────────────────────────────────────────────────────
async function getRequestBody(req: http.IncomingMessage): Promise<any> {
  return new Promise((resolve, reject) => {
    let body = '';
    req.on('data', (chunk) => {
      body += chunk.toString();
    });
    req.on('end', () => {
      try {
        resolve(body ? JSON.parse(body) : {});
      } catch (err) {
        reject(err);
      }
    });
    req.on('error', (err) => {
      reject(err);
    });
  });
}

function isAuthorizedAdmin(req: http.IncomingMessage, urlObj: URL): boolean {
  const ADMIN_TOKEN = process.env.ADMIN_SECRET_TOKEN ?? 'stellr-admin-dev-2024';
  const tokenHeader = req.headers['x-admin-token'];
  const tokenQuery = urlObj.searchParams.get('token');
  const token = (Array.isArray(tokenHeader) ? tokenHeader[0] : tokenHeader) || tokenQuery;
  return token === ADMIN_TOKEN;
}

// ─── Server ──────────────────────────────────────────────────────────────────
const server = http.createServer(async (req, res) => {
  const urlObj = new URL(req.url || '', `http://${req.headers.host}`);
  const { pathname } = urlObj;

  // 1. CORS headers
  const allowedOrigins = [
    'http://localhost:8083',
    'http://localhost:8081',
    'http://localhost:5173',
    'http://localhost:3000',
  ];
  const origin = req.headers.origin;
  if (origin && allowedOrigins.includes(origin)) {
    res.setHeader('Access-Control-Allow-Origin', origin);
  } else {
    res.setHeader('Access-Control-Allow-Origin', '*');
  }
  res.setHeader('Access-Control-Allow-Credentials', 'true');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PATCH, PUT, DELETE, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization, X-Requested-With, x-admin-token');

  // Preflight
  if (req.method === 'OPTIONS') {
    res.statusCode = 204;
    res.end();
    return;
  }

  try {
    // 2. Routing
    // SSE endpoint
    if (req.method === 'GET' && pathname === '/api/stream') {
      const role = urlObj.searchParams.get('role');
      const sessionId = urlObj.searchParams.get('sessionId') || undefined;

      if (role !== 'admin' && role !== 'visitor') {
        res.statusCode = 400;
        res.setHeader('Content-Type', 'application/json');
        res.end(JSON.stringify({ error: 'Invalid role' }));
        return;
      }

      if (role === 'visitor' && !sessionId) {
        res.statusCode = 400;
        res.setHeader('Content-Type', 'application/json');
        res.end(JSON.stringify({ error: 'sessionId required for visitor role' }));
        return;
      }

      // Keep connection alive
      res.writeHead(200, {
        'Content-Type': 'text/event-stream',
        'Cache-Control': 'no-cache, no-transform',
        'Connection': 'keep-alive',
      });

      const client: SseClient = { res, role, sessionId };
      sseClients.push(client);

      res.write(`data: ${JSON.stringify({ type: 'connected' })}\n\n`);

      req.on('close', () => {
        const idx = sseClients.indexOf(client);
        if (idx !== -1) {
          sseClients.splice(idx, 1);
        }
      });
      return;
    }

    // Health Check
    if (req.method === 'GET' && pathname === '/health') {
      res.writeHead(200, { 'Content-Type': 'application/json' });
      res.end(JSON.stringify({ status: 'ok', ts: new Date().toISOString() }));
      return;
    }

    // POST /api/chat/session
    if (req.method === 'POST' && pathname === '/api/chat/session') {
      const body = await getRequestBody(req);
      const visitorName = sanitize(body.visitorName || 'Visitor');
      const visitorPhoneOrEmail = sanitize(body.visitorPhoneOrEmail || '');
      const visitorId = body.visitorId || `visitor-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;

      const db = readDb();
      let session = db.sessions.find((s) => s.visitorId === visitorId && s.status === 'open');

      if (!session) {
        session = {
          id: `session-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
          visitorId,
          visitorName,
          visitorPhoneOrEmail,
          status: 'open',
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
        };
        db.sessions.push(session);
        writeDb(db);

        broadcast({ type: 'session-created', data: session });
      }

      res.writeHead(201, { 'Content-Type': 'application/json' });
      res.end(JSON.stringify(session));
      return;
    }

    // GET /api/chat/session/:id
    const getSessionMatch = pathname.match(/^\/api\/chat\/session\/([^/]+)$/);
    if (req.method === 'GET' && getSessionMatch) {
      const sessionId = getSessionMatch[1];
      const db = readDb();
      const session = db.sessions.find((s) => s.id === sessionId);

      if (!session) {
        res.statusCode = 404;
        res.setHeader('Content-Type', 'application/json');
        res.end(JSON.stringify({ error: 'Session not found' }));
        return;
      }

      res.writeHead(200, { 'Content-Type': 'application/json' });
      res.end(JSON.stringify(session));
      return;
    }

    // GET /api/chat/session/:id/messages
    const getMessagesMatch = pathname.match(/^\/api\/chat\/session\/([^/]+)\/messages$/);
    if (req.method === 'GET' && getMessagesMatch) {
      const sessionId = getMessagesMatch[1];
      const db = readDb();
      const session = db.sessions.find((s) => s.id === sessionId);

      if (!session) {
        res.statusCode = 404;
        res.setHeader('Content-Type', 'application/json');
        res.end(JSON.stringify({ error: 'Session not found' }));
        return;
      }

      const messages = db.messages.filter((m) => m.sessionId === sessionId);
      res.writeHead(200, { 'Content-Type': 'application/json' });
      res.end(JSON.stringify(messages));
      return;
    }

    // POST /api/chat/session/:id/message
    const postMessageMatch = pathname.match(/^\/api\/chat\/session\/([^/]+)\/message$/);
    if (req.method === 'POST' && postMessageMatch) {
      const sessionId = postMessageMatch[1];
      const body = await getRequestBody(req);
      const messageText = sanitize(body.message || '');

      if (!messageText) {
        res.statusCode = 400;
        res.setHeader('Content-Type', 'application/json');
        res.end(JSON.stringify({ error: 'Message cannot be empty' }));
        return;
      }

      const db = readDb();
      const session = db.sessions.find((s) => s.id === sessionId);

      if (!session) {
        res.statusCode = 404;
        res.setHeader('Content-Type', 'application/json');
        res.end(JSON.stringify({ error: 'Session not found' }));
        return;
      }

      if (session.status === 'closed') {
        res.statusCode = 403;
        res.setHeader('Content-Type', 'application/json');
        res.end(JSON.stringify({ error: 'This conversation is closed' }));
        return;
      }

      const savedMsg: DbMessage = {
        id: `msg-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
        sessionId,
        senderType: 'visitor',
        message: messageText,
        createdAt: new Date().toISOString(),
        readAt: null,
      };

      db.messages.push(savedMsg);
      session.updatedAt = new Date().toISOString();
      writeDb(db);

      broadcast({ type: 'new-message', data: savedMsg }, sessionId);

      res.writeHead(201, { 'Content-Type': 'application/json' });
      res.end(JSON.stringify(savedMsg));
      return;
    }

    // GET /api/admin/chats
    if (req.method === 'GET' && pathname === '/api/admin/chats') {
      if (!isAuthorizedAdmin(req, urlObj)) {
        res.statusCode = 401;
        res.setHeader('Content-Type', 'application/json');
        res.end(JSON.stringify({ error: 'Unauthorized' }));
        return;
      }

      const statusFilter = urlObj.searchParams.get('status');
      const searchFilter = urlObj.searchParams.get('search');

      const db = readDb();
      let filteredSessions = db.sessions;

      if (statusFilter === 'open' || statusFilter === 'closed') {
        filteredSessions = filteredSessions.filter((s) => s.status === statusFilter);
      }
      if (searchFilter) {
        const term = searchFilter.toLowerCase();
        filteredSessions = filteredSessions.filter(
          (s) =>
            s.visitorName.toLowerCase().includes(term) ||
            s.visitorPhoneOrEmail.toLowerCase().includes(term)
        );
      }

      filteredSessions.sort((a, b) => new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime());

      const withUnread = filteredSessions.map((s) => {
        const unreadCount = db.messages.filter(
          (m) => m.sessionId === s.id && m.senderType === 'visitor' && !m.readAt
        ).length;
        const sessionMsgs = db.messages.filter((m) => m.sessionId === s.id);
        const lastMsg = sessionMsgs.length > 0 ? sessionMsgs[sessionMsgs.length - 1] : null;
        return {
          id: s.id,
          visitorId: s.visitorId,
          visitorName: s.visitorName,
          visitorPhoneOrEmail: s.visitorPhoneOrEmail,
          status: s.status,
          createdAt: s.createdAt,
          updatedAt: s.updatedAt,
          unreadCount,
          lastMessage: lastMsg?.message ?? '',
          lastMessageAt: lastMsg?.createdAt ?? s.createdAt,
        };
      });

      res.writeHead(200, { 'Content-Type': 'application/json' });
      res.end(JSON.stringify(withUnread));
      return;
    }

    // GET /api/admin/chats/:id
    const getAdminSessionMatch = pathname.match(/^\/api\/admin\/chats\/([^/]+)$/);
    if (req.method === 'GET' && getAdminSessionMatch) {
      if (!isAuthorizedAdmin(req, urlObj)) {
        res.statusCode = 401;
        res.setHeader('Content-Type', 'application/json');
        res.end(JSON.stringify({ error: 'Unauthorized' }));
        return;
      }

      const sessionId = getAdminSessionMatch[1];
      const db = readDb();
      const session = db.sessions.find((s) => s.id === sessionId);

      if (!session) {
        res.statusCode = 404;
        res.setHeader('Content-Type', 'application/json');
        res.end(JSON.stringify({ error: 'Session not found' }));
        return;
      }

      const messages = db.messages.filter((m) => m.sessionId === sessionId);
      res.writeHead(200, { 'Content-Type': 'application/json' });
      res.end(
        JSON.stringify({
          session,
          messages,
        })
      );
      return;
    }

    // POST /api/admin/chat/:id/message
    const postAdminMessageMatch = pathname.match(/^\/api\/admin\/chat\/([^/]+)\/message$/);
    if (req.method === 'POST' && postAdminMessageMatch) {
      if (!isAuthorizedAdmin(req, urlObj)) {
        res.statusCode = 401;
        res.setHeader('Content-Type', 'application/json');
        res.end(JSON.stringify({ error: 'Unauthorized' }));
        return;
      }

      const sessionId = postAdminMessageMatch[1];
      const body = await getRequestBody(req);
      const messageText = sanitize(body.message || '');

      if (!messageText) {
        res.statusCode = 400;
        res.setHeader('Content-Type', 'application/json');
        res.end(JSON.stringify({ error: 'Message cannot be empty' }));
        return;
      }

      const db = readDb();
      const session = db.sessions.find((s) => s.id === sessionId);

      if (!session) {
        res.statusCode = 404;
        res.setHeader('Content-Type', 'application/json');
        res.end(JSON.stringify({ error: 'Session not found' }));
        return;
      }

      const savedMsg: DbMessage = {
        id: `msg-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
        sessionId,
        senderType: 'admin',
        message: messageText,
        createdAt: new Date().toISOString(),
        readAt: null,
      };

      db.messages.push(savedMsg);
      session.updatedAt = new Date().toISOString();
      writeDb(db);

      broadcast({ type: 'new-message', data: savedMsg }, sessionId);

      res.writeHead(201, { 'Content-Type': 'application/json' });
      res.end(JSON.stringify(savedMsg));
      return;
    }

    // PATCH /api/admin/chat/:id/status
    const patchStatusMatch = pathname.match(/^\/api\/admin\/chat\/([^/]+)\/status$/);
    if (req.method === 'PATCH' && patchStatusMatch) {
      if (!isAuthorizedAdmin(req, urlObj)) {
        res.statusCode = 401;
        res.setHeader('Content-Type', 'application/json');
        res.end(JSON.stringify({ error: 'Unauthorized' }));
        return;
      }

      const sessionId = patchStatusMatch[1];
      const body = await getRequestBody(req);
      const status = body.status;

      if (status !== 'open' && status !== 'closed') {
        res.statusCode = 400;
        res.setHeader('Content-Type', 'application/json');
        res.end(JSON.stringify({ error: 'Invalid status' }));
        return;
      }

      const db = readDb();
      const session = db.sessions.find((s) => s.id === sessionId);

      if (!session) {
        res.statusCode = 404;
        res.setHeader('Content-Type', 'application/json');
        res.end(JSON.stringify({ error: 'Session not found' }));
        return;
      }

      session.status = status;
      session.updatedAt = new Date().toISOString();
      writeDb(db);

      broadcast({ type: 'session-updated', data: { id: sessionId, status } }, sessionId);

      res.writeHead(200, { 'Content-Type': 'application/json' });
      res.end(JSON.stringify({ id: sessionId, status }));
      return;
    }

    // POST /api/chat/typing
    if (req.method === 'POST' && pathname === '/api/chat/typing') {
      const body = await getRequestBody(req);
      const { sessionId, senderType, isTyping } = body;

      if (!sessionId || !senderType) {
        res.statusCode = 400;
        res.setHeader('Content-Type', 'application/json');
        res.end(JSON.stringify({ error: 'Missing parameters' }));
        return;
      }

      broadcast(
        {
          type: isTyping ? 'typing-start' : 'typing-stop',
          data: { sessionId, senderType },
        },
        sessionId
      );

      res.writeHead(200, { 'Content-Type': 'application/json' });
      res.end(JSON.stringify({ success: true }));
      return;
    }

    // POST /api/chat/read
    if (req.method === 'POST' && pathname === '/api/chat/read') {
      const body = await getRequestBody(req);
      const { sessionId, readBy } = body;

      if (!sessionId || !readBy) {
        res.statusCode = 400;
        res.setHeader('Content-Type', 'application/json');
        res.end(JSON.stringify({ error: 'Missing parameters' }));
        return;
      }

      const db = readDb();
      let updated = false;
      db.messages.forEach((m) => {
        if (m.sessionId === sessionId && m.senderType !== readBy && !m.readAt) {
          m.readAt = new Date().toISOString();
          updated = true;
        }
      });

      if (updated) {
        writeDb(db);
      }

      broadcast({ type: 'message-read', data: { sessionId, readBy } }, sessionId);

      res.writeHead(200, { 'Content-Type': 'application/json' });
      res.end(JSON.stringify({ success: true }));
      return;
    }

    // 404 Fallback
    res.statusCode = 404;
    res.setHeader('Content-Type', 'application/json');
    res.end(JSON.stringify({ error: 'Route not found' }));
  } catch (err: any) {
    console.error(`Error handling request ${req.method} ${pathname}:`, err);
    res.statusCode = 500;
    res.setHeader('Content-Type', 'application/json');
    res.end(JSON.stringify({ error: 'Internal server error', message: err?.message }));
  }
});

server.listen(PORT, () => {
  console.log(`🚀  Native Live Chat Server running at http://localhost:${PORT}`);
});
