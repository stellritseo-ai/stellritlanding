import http from 'node:http';
import fs from 'node:fs';
import path from 'node:path';
import dotenv from 'dotenv';
import mongoose from 'mongoose';
import { ChatSession } from './models/ChatSession.js';
import { ChatMessage } from './models/ChatMessage.js';

// Try loading env from root or current directory
const envPaths = [
  path.join(process.cwd(), '../.env'),
  path.join(process.cwd(), '.env'),
];
for (const envPath of envPaths) {
  if (fs.existsSync(envPath)) {
    dotenv.config({ path: envPath });
    break;
  }
}

const PORT = Number(process.env.CHAT_SERVER_PORT ?? 3001);
const MONGO_URI = process.env.DATABASE_URL;

if (!MONGO_URI) {
  console.error('❌ Error: DATABASE_URL environment variable is not set.');
  process.exit(1);
}

async function getStandardMongoUri(srvUri: string): Promise<string> {
  if (!srvUri.startsWith('mongodb+srv://')) {
    return srvUri;
  }
  try {
    console.log('🔄 Resolving mongodb+srv:// SRV records via Google DNS-over-HTTPS...');
    const match = srvUri.match(/^mongodb\+srv:\/\/([^:]+):([^@]+)@([^/?#\s]+)/);
    if (!match) return srvUri;
    const [_, user, pass, host] = match;

    const srvRes = await fetch(`https://dns.google/resolve?name=_mongodb._tcp.${host}&type=SRV`);
    const srvJson: any = await srvRes.json();
    if (!srvJson.Answer || srvJson.Answer.length === 0) {
      throw new Error('No SRV answers found');
    }
    const hosts = srvJson.Answer.map((ans: any) => {
      const parts = ans.data.split(' ');
      const targetHost = parts[3].replace(/\.$/, '');
      const port = parts[2];
      return `${targetHost}:${port}`;
    }).join(',');

    const txtRes = await fetch(`https://dns.google/resolve?name=${host}&type=TXT`);
    const txtJson: any = await txtRes.json();
    let options = 'ssl=true';
    if (txtJson.Answer && txtJson.Answer.length > 0) {
      const rawTxt = txtJson.Answer.map((a: any) => a.data).join('&').replace(/"/g, '');
      options += `&${rawTxt}`;
    }

    const standardUri = `mongodb://${user}:${pass}@${hosts}/?${options}`;
    return standardUri;
  } catch (err) {
    console.warn('⚠️ Google DNS-over-HTTPS resolution failed, using original URI:', err);
    return srvUri;
  }
}

// Connect to MongoDB
try {
  const resolvedUri = await getStandardMongoUri(MONGO_URI);
  await mongoose.connect(resolvedUri);
  console.log('🔌 Connected to MongoDB successfully via Mongoose.');
} catch (err) {
  console.error('❌ MongoDB connection error:', err);
  process.exit(1);
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
      const visitorId = body.visitorId || `visitor-${Date.now()}-${Math.random().toString(36).substring(2, 9)}`;

      let session = await ChatSession.findOne({ visitorId, status: 'open' });

      if (!session) {
        session = await ChatSession.create({
          visitorId,
          visitorName,
          visitorPhoneOrEmail,
          status: 'open',
        });

        broadcast({
          type: 'session-created',
          data: {
            id: session._id.toString(),
            visitorId: session.visitorId,
            visitorName: session.visitorName,
            visitorPhoneOrEmail: session.visitorPhoneOrEmail,
            status: session.status,
            createdAt: session.createdAt.toISOString(),
            updatedAt: session.updatedAt.toISOString(),
          }
        });
      }

      res.writeHead(201, { 'Content-Type': 'application/json' });
      res.end(
        JSON.stringify({
          id: session._id.toString(),
          visitorId: session.visitorId,
          visitorName: session.visitorName,
          visitorPhoneOrEmail: session.visitorPhoneOrEmail,
          status: session.status,
          createdAt: session.createdAt.toISOString(),
          updatedAt: session.updatedAt.toISOString(),
        })
      );
      return;
    }

    // GET /api/chat/session/:id
    const getSessionMatch = pathname.match(/^\/api\/chat\/session\/([^/]+)$/);
    if (req.method === 'GET' && getSessionMatch) {
      const sessionId = getSessionMatch[1];
      
      if (!mongoose.Types.ObjectId.isValid(sessionId)) {
        res.statusCode = 404;
        res.setHeader('Content-Type', 'application/json');
        res.end(JSON.stringify({ error: 'Session not found' }));
        return;
      }

      const session = await ChatSession.findById(sessionId);

      if (!session) {
        res.statusCode = 404;
        res.setHeader('Content-Type', 'application/json');
        res.end(JSON.stringify({ error: 'Session not found' }));
        return;
      }

      res.writeHead(200, { 'Content-Type': 'application/json' });
      res.end(
        JSON.stringify({
          id: session._id.toString(),
          visitorId: session.visitorId,
          visitorName: session.visitorName,
          visitorPhoneOrEmail: session.visitorPhoneOrEmail,
          status: session.status,
          createdAt: session.createdAt.toISOString(),
          updatedAt: session.updatedAt.toISOString(),
        })
      );
      return;
    }

    // GET /api/chat/session/:id/messages
    const getMessagesMatch = pathname.match(/^\/api\/chat\/session\/([^/]+)\/messages$/);
    if (req.method === 'GET' && getMessagesMatch) {
      const sessionId = getMessagesMatch[1];

      if (!mongoose.Types.ObjectId.isValid(sessionId)) {
        res.statusCode = 404;
        res.setHeader('Content-Type', 'application/json');
        res.end(JSON.stringify({ error: 'Session not found' }));
        return;
      }

      const session = await ChatSession.findById(sessionId);

      if (!session) {
        res.statusCode = 404;
        res.setHeader('Content-Type', 'application/json');
        res.end(JSON.stringify({ error: 'Session not found' }));
        return;
      }

      const messages = await ChatMessage.find({ sessionId: session._id }).sort({ createdAt: 1 });
      res.writeHead(200, { 'Content-Type': 'application/json' });
      res.end(
        JSON.stringify(
          messages.map((m) => ({
            id: m._id.toString(),
            sessionId: m.sessionId.toString(),
            senderType: m.senderType,
            message: m.message,
            createdAt: m.createdAt.toISOString(),
            readAt: m.readAt ? m.readAt.toISOString() : null,
          }))
        )
      );
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

      if (!mongoose.Types.ObjectId.isValid(sessionId)) {
        res.statusCode = 404;
        res.setHeader('Content-Type', 'application/json');
        res.end(JSON.stringify({ error: 'Session not found' }));
        return;
      }

      const session = await ChatSession.findById(sessionId);

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

      const savedMsg = await ChatMessage.create({
        sessionId: session._id,
        senderType: 'visitor',
        message: messageText,
      });

      session.updatedAt = new Date();
      await session.save();

      const msgPayload = {
        id: savedMsg._id.toString(),
        sessionId: savedMsg.sessionId.toString(),
        senderType: savedMsg.senderType,
        message: savedMsg.message,
        createdAt: savedMsg.createdAt.toISOString(),
        readAt: null,
      };

      broadcast({ type: 'new-message', data: msgPayload }, sessionId);

      res.writeHead(201, { 'Content-Type': 'application/json' });
      res.end(JSON.stringify(msgPayload));
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

      const filter: any = {};
      if (statusFilter === 'open' || statusFilter === 'closed') {
        filter.status = statusFilter;
      }
      if (searchFilter) {
        const regex = new RegExp(searchFilter, 'i');
        filter.$or = [{ visitorName: regex }, { visitorPhoneOrEmail: regex }];
      }

      const sessions = await ChatSession.find(filter).sort({ updatedAt: -1 });

      const withUnread = await Promise.all(
        sessions.map(async (s) => {
          const unreadCount = await ChatMessage.countDocuments({
            sessionId: s._id,
            senderType: 'visitor',
            readAt: null,
          });
          const lastMsg = await ChatMessage.findOne({ sessionId: s._id }).sort({ createdAt: -1 });
          return {
            id: s._id.toString(),
            visitorId: s.visitorId,
            visitorName: s.visitorName,
            visitorPhoneOrEmail: s.visitorPhoneOrEmail,
            status: s.status,
            createdAt: s.createdAt.toISOString(),
            updatedAt: s.updatedAt.toISOString(),
            unreadCount,
            lastMessage: lastMsg?.message ?? '',
            lastMessageAt: lastMsg?.createdAt ? lastMsg.createdAt.toISOString() : s.createdAt.toISOString(),
          };
        })
      );

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

      if (!mongoose.Types.ObjectId.isValid(sessionId)) {
        res.statusCode = 404;
        res.setHeader('Content-Type', 'application/json');
        res.end(JSON.stringify({ error: 'Session not found' }));
        return;
      }

      const session = await ChatSession.findById(sessionId);

      if (!session) {
        res.statusCode = 404;
        res.setHeader('Content-Type', 'application/json');
        res.end(JSON.stringify({ error: 'Session not found' }));
        return;
      }

      const messages = await ChatMessage.find({ sessionId: session._id }).sort({ createdAt: 1 });
      res.writeHead(200, { 'Content-Type': 'application/json' });
      res.end(
        JSON.stringify({
          session: {
            id: session._id.toString(),
            visitorId: session.visitorId,
            visitorName: session.visitorName,
            visitorPhoneOrEmail: session.visitorPhoneOrEmail,
            status: session.status,
            createdAt: session.createdAt.toISOString(),
            updatedAt: session.updatedAt.toISOString(),
          },
          messages: messages.map((m) => ({
            id: m._id.toString(),
            sessionId: m.sessionId.toString(),
            senderType: m.senderType,
            message: m.message,
            createdAt: m.createdAt.toISOString(),
            readAt: m.readAt ? m.readAt.toISOString() : null,
          })),
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

      if (!mongoose.Types.ObjectId.isValid(sessionId)) {
        res.statusCode = 404;
        res.setHeader('Content-Type', 'application/json');
        res.end(JSON.stringify({ error: 'Session not found' }));
        return;
      }

      const session = await ChatSession.findById(sessionId);

      if (!session) {
        res.statusCode = 404;
        res.setHeader('Content-Type', 'application/json');
        res.end(JSON.stringify({ error: 'Session not found' }));
        return;
      }

      const savedMsg = await ChatMessage.create({
        sessionId: session._id,
        senderType: 'admin',
        message: messageText,
      });

      session.updatedAt = new Date();
      await session.save();

      const msgPayload = {
        id: savedMsg._id.toString(),
        sessionId: savedMsg.sessionId.toString(),
        senderType: savedMsg.senderType,
        message: savedMsg.message,
        createdAt: savedMsg.createdAt.toISOString(),
        readAt: null,
      };

      broadcast({ type: 'new-message', data: msgPayload }, sessionId);

      res.writeHead(201, { 'Content-Type': 'application/json' });
      res.end(JSON.stringify(msgPayload));
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

      if (!mongoose.Types.ObjectId.isValid(sessionId)) {
        res.statusCode = 404;
        res.setHeader('Content-Type', 'application/json');
        res.end(JSON.stringify({ error: 'Session not found' }));
        return;
      }

      const session = await ChatSession.findByIdAndUpdate(
        sessionId,
        { status, updatedAt: new Date() },
        { new: true }
      );

      if (!session) {
        res.statusCode = 404;
        res.setHeader('Content-Type', 'application/json');
        res.end(JSON.stringify({ error: 'Session not found' }));
        return;
      }

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

      if (!mongoose.Types.ObjectId.isValid(sessionId)) {
        res.statusCode = 400;
        res.setHeader('Content-Type', 'application/json');
        res.end(JSON.stringify({ error: 'Invalid sessionId' }));
        return;
      }

      const oppositeSender = readBy === 'admin' ? 'visitor' : 'admin';

      await ChatMessage.updateMany(
        {
          sessionId: new mongoose.Types.ObjectId(sessionId),
          senderType: oppositeSender,
          readAt: null,
        },
        { readAt: new Date() }
      );

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
