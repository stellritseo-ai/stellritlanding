import { Router, Request, Response } from 'express';
import { v4 as uuidv4 } from 'uuid';
import rateLimit from 'express-rate-limit';
import { z } from 'zod';
import { ChatSession } from '../models/ChatSession.js';
import { ChatMessage } from '../models/ChatMessage.js';
import { adminAuth } from '../middleware/auth.js';

export const chatRouter = Router();

// ─── Sanitization helper ──────────────────────────────────────────────────────
function sanitize(text: any): string {
  const str = typeof text === 'string' ? text : String(text ?? '');
  return str
    .replace(/<[^>]*>/g, '') // strip HTML
    .replace(/javascript:/gi, '') // strip js: URIs
    .trim()
    .slice(0, 2000);
}

// ─── Rate limiter for visitor messages ───────────────────────────────────────
const visitorMsgLimiter = rateLimit({
  windowMs: 60 * 1000, // 1 min
  max: 20,
  message: { error: 'Too many messages, slow down.' },
  standardHeaders: true,
  legacyHeaders: false,
});

// ═══════════════════════════════════════════════════════════════
// VISITOR ROUTES
// ═══════════════════════════════════════════════════════════════

// POST /api/chat/session — Create visitor session
const CreateSessionSchema = z.object({
  visitorId: z.string().min(1).max(100).optional(),
  visitorName: z.string().min(1).max(100).default('Visitor'),
  visitorPhoneOrEmail: z.string().max(200).default(''),
});

chatRouter.post('/chat/session', async (req: Request, res: Response) => {
  try {
    const parsed = CreateSessionSchema.safeParse(req.body);
    if (!parsed.success) {
      res.status(400).json({ error: 'Invalid input', details: parsed.error.flatten() });
      return;
    }

    const { visitorName, visitorPhoneOrEmail } = parsed.data;
    const visitorId = parsed.data.visitorId || uuidv4();

    // Check for existing open session for this visitor
    let session = await ChatSession.findOne({ visitorId, status: 'open' });

    if (!session) {
      session = await ChatSession.create({
        visitorId,
        visitorName: sanitize(visitorName),
        visitorPhoneOrEmail: sanitize(visitorPhoneOrEmail),
        status: 'open',
      });

      // Notify admin room of new session via socket
      const io = req.app.get('io');
      io?.to('admin').emit('session-created', {
        id: session._id,
        visitorId: session.visitorId,
        visitorName: session.visitorName,
        visitorPhoneOrEmail: session.visitorPhoneOrEmail,
        status: session.status,
        createdAt: session.createdAt,
        updatedAt: session.updatedAt,
      });
    }

    res.status(201).json({
      id: session._id,
      visitorId: session.visitorId,
      visitorName: session.visitorName,
      visitorPhoneOrEmail: session.visitorPhoneOrEmail,
      status: session.status,
      createdAt: session.createdAt,
      updatedAt: session.updatedAt,
    });
  } catch (err) {
    console.error('POST /chat/session error:', err);
    res.status(500).json({ error: 'Server error' });
  }
});

// GET /api/chat/session/:id — Get session info
chatRouter.get('/chat/session/:id', async (req: Request, res: Response) => {
  try {
    const session = await ChatSession.findById(req.params.id);
    if (!session) {
      res.status(404).json({ error: 'Session not found' });
      return;
    }
    res.json({
      id: session._id,
      visitorId: session.visitorId,
      visitorName: session.visitorName,
      visitorPhoneOrEmail: session.visitorPhoneOrEmail,
      status: session.status,
      createdAt: session.createdAt,
      updatedAt: session.updatedAt,
    });
  } catch (err) {
    console.error('GET /chat/session/:id error:', err);
    res.status(500).json({ error: 'Server error' });
  }
});

// GET /api/chat/session/:id/messages — Get chat history
chatRouter.get('/chat/session/:id/messages', async (req: Request, res: Response) => {
  try {
    const session = await ChatSession.findById(req.params.id);
    if (!session) {
      res.status(404).json({ error: 'Session not found' });
      return;
    }

    const messages = await ChatMessage.find({ sessionId: req.params.id })
      .sort({ createdAt: 1 })
      .limit(200);

    res.json(
      messages.map((m) => ({
        id: m._id,
        sessionId: m.sessionId,
        senderType: m.senderType,
        message: m.message,
        createdAt: m.createdAt,
        readAt: m.readAt,
      }))
    );
  } catch (err) {
    console.error('GET /chat/session/:id/messages error:', err);
    res.status(500).json({ error: 'Server error' });
  }
});

// POST /api/chat/session/:id/message — Send visitor message
const SendMessageSchema = z.object({
  message: z.string().min(1).max(2000),
});

chatRouter.post(
  '/chat/session/:id/message',
  visitorMsgLimiter,
  async (req: Request, res: Response) => {
    try {
      const parsed = SendMessageSchema.safeParse(req.body);
      if (!parsed.success) {
        res.status(400).json({ error: 'Invalid message', details: parsed.error.flatten() });
        return;
      }

      const session = await ChatSession.findById(req.params.id);
      if (!session) {
        res.status(404).json({ error: 'Session not found' });
        return;
      }
      if (session.status === 'closed') {
        res.status(403).json({ error: 'This conversation is closed' });
        return;
      }

      const savedMsg = await ChatMessage.create({
        sessionId: session._id,
        senderType: 'visitor',
        message: sanitize(parsed.data.message),
      });

      // Update session updatedAt
      session.updatedAt = new Date();
      await session.save();

      const msgPayload = {
        id: savedMsg._id,
        sessionId: savedMsg.sessionId,
        senderType: savedMsg.senderType,
        message: savedMsg.message,
        createdAt: savedMsg.createdAt,
        readAt: savedMsg.readAt,
      };

      // Broadcast via socket
      const io = req.app.get('io');
      io?.to(`session:${req.params.id}`).emit('new-message', msgPayload);
      io?.to('admin').emit('new-message', msgPayload);

      res.status(201).json(msgPayload);
    } catch (err) {
      console.error('POST /chat/session/:id/message error:', err);
      res.status(500).json({ error: 'Server error' });
    }
  }
);

// ═══════════════════════════════════════════════════════════════
// ADMIN ROUTES
// ═══════════════════════════════════════════════════════════════

// GET /api/admin/chats — List all chat sessions
chatRouter.get('/admin/chats', adminAuth, async (req: Request, res: Response) => {
  try {
    const { status, search } = req.query as { status?: string; search?: string };

    const filter: Record<string, unknown> = {};
    if (status === 'open' || status === 'closed') filter.status = status;
    if (search) {
      const regex = new RegExp(search, 'i');
      filter.$or = [{ visitorName: regex }, { visitorPhoneOrEmail: regex }];
    }

    const sessions = await ChatSession.find(filter).sort({ updatedAt: -1 }).limit(100);

    // Attach unread count for each session
    const withUnread = await Promise.all(
      sessions.map(async (s) => {
        const unread = await ChatMessage.countDocuments({
          sessionId: s._id,
          senderType: 'visitor',
          readAt: null,
        });
        const lastMsg = await ChatMessage.findOne({ sessionId: s._id }).sort({ createdAt: -1 });
        return {
          id: s._id,
          visitorId: s.visitorId,
          visitorName: s.visitorName,
          visitorPhoneOrEmail: s.visitorPhoneOrEmail,
          status: s.status,
          createdAt: s.createdAt,
          updatedAt: s.updatedAt,
          unreadCount: unread,
          lastMessage: lastMsg?.message ?? '',
          lastMessageAt: lastMsg?.createdAt ?? s.createdAt,
        };
      })
    );

    res.json(withUnread);
  } catch (err) {
    console.error('GET /admin/chats error:', err);
    res.status(500).json({ error: 'Server error' });
  }
});

// GET /api/admin/chats/:id — Get session details + messages
chatRouter.get('/admin/chats/:id', adminAuth, async (req: Request, res: Response) => {
  try {
    const session = await ChatSession.findById(req.params.id);
    if (!session) {
      res.status(404).json({ error: 'Session not found' });
      return;
    }

    const messages = await ChatMessage.find({ sessionId: req.params.id })
      .sort({ createdAt: 1 })
      .limit(200);

    res.json({
      session: {
        id: session._id,
        visitorId: session.visitorId,
        visitorName: session.visitorName,
        visitorPhoneOrEmail: session.visitorPhoneOrEmail,
        status: session.status,
        createdAt: session.createdAt,
        updatedAt: session.updatedAt,
      },
      messages: messages.map((m) => ({
        id: m._id,
        sessionId: m.sessionId,
        senderType: m.senderType,
        message: m.message,
        createdAt: m.createdAt,
        readAt: m.readAt,
      })),
    });
  } catch (err) {
    console.error('GET /admin/chats/:id error:', err);
    res.status(500).json({ error: 'Server error' });
  }
});

// POST /api/admin/chat/:id/message — Send admin reply
chatRouter.post('/admin/chat/:id/message', adminAuth, async (req: Request, res: Response) => {
  try {
    const parsed = SendMessageSchema.safeParse(req.body);
    if (!parsed.success) {
      res.status(400).json({ error: 'Invalid message', details: parsed.error.flatten() });
      return;
    }

    const session = await ChatSession.findById(req.params.id);
    if (!session) {
      res.status(404).json({ error: 'Session not found' });
      return;
    }

    const savedMsg = await ChatMessage.create({
      sessionId: session._id,
      senderType: 'admin',
      message: sanitize(parsed.data.message),
    });

    session.updatedAt = new Date();
    await session.save();

    const msgPayload = {
      id: savedMsg._id,
      sessionId: savedMsg.sessionId,
      senderType: savedMsg.senderType,
      message: savedMsg.message,
      createdAt: savedMsg.createdAt,
      readAt: savedMsg.readAt,
    };

    // Broadcast via socket
    const io = req.app.get('io');
    io?.to(`session:${req.params.id}`).emit('new-message', msgPayload);
    io?.to('admin').emit('new-message', msgPayload);

    res.status(201).json(msgPayload);
  } catch (err) {
    console.error('POST /admin/chat/:id/message error:', err);
    res.status(500).json({ error: 'Server error' });
  }
});

// PATCH /api/admin/chat/:id/status — Update session status
chatRouter.patch('/admin/chat/:id/status', adminAuth, async (req: Request, res: Response) => {
  try {
    const StatusSchema = z.object({ status: z.enum(['open', 'closed']) });
    const parsed = StatusSchema.safeParse(req.body);
    if (!parsed.success) {
      res.status(400).json({ error: 'Invalid status' });
      return;
    }

    const session = await ChatSession.findByIdAndUpdate(
      req.params.id,
      { status: parsed.data.status },
      { new: true }
    );

    if (!session) {
      res.status(404).json({ error: 'Session not found' });
      return;
    }

    const io = req.app.get('io');
    io?.to(`session:${req.params.id}`).emit('session-updated', {
      id: session._id,
      status: session.status,
    });
    io?.to('admin').emit('session-updated', {
      id: session._id,
      status: session.status,
    });

    res.json({ id: session._id, status: session.status });
  } catch (err) {
    console.error('PATCH /admin/chat/:id/status error:', err);
    res.status(500).json({ error: 'Server error' });
  }
});
