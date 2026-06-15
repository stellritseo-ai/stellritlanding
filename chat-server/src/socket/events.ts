import { Server, Socket } from 'socket.io';
import { ChatMessage } from '../models/ChatMessage.js';

export function setupSocketHandlers(io: Server): void {
  io.on('connection', (socket: Socket) => {
    console.log(`🔌 Socket connected: ${socket.id}`);

    // Visitor joins their session room
    socket.on('join-chat', (sessionId: string) => {
      if (!sessionId) return;
      socket.join(`session:${sessionId}`);
      console.log(`👤 Visitor joined session room: ${sessionId}`);
    });

    // Admin joins the global admin notification room
    socket.on('join-admin', () => {
      socket.join('admin');
      console.log(`🛡️  Admin socket ${socket.id} joined admin room`);
    });

    // Admin joins a specific session room to watch a conversation
    socket.on('join-session', (sessionId: string) => {
      if (!sessionId) return;
      socket.join(`session:${sessionId}`);
      console.log(`🛡️  Admin joined session room: ${sessionId}`);
    });

    // Admin leaves a session room
    socket.on('leave-session', (sessionId: string) => {
      if (!sessionId) return;
      socket.leave(`session:${sessionId}`);
    });

    // Typing indicators — broadcast to the other party
    socket.on(
      'typing-start',
      (data: { sessionId: string; senderType: 'visitor' | 'admin' }) => {
        socket.to(`session:${data.sessionId}`).emit('typing-start', data);
        if (data.senderType === 'visitor') {
          socket.to('admin').emit('typing-start', data);
        }
      }
    );

    socket.on(
      'typing-stop',
      (data: { sessionId: string; senderType: 'visitor' | 'admin' }) => {
        socket.to(`session:${data.sessionId}`).emit('typing-stop', data);
        if (data.senderType === 'visitor') {
          socket.to('admin').emit('typing-stop', data);
        }
      }
    );

    // Mark messages as read (called when admin opens a session)
    socket.on(
      'message-read',
      async (data: { sessionId: string; readBy: 'visitor' | 'admin' }) => {
        try {
          const oppositeSender = data.readBy === 'admin' ? 'visitor' : 'admin';
          await ChatMessage.updateMany(
            {
              sessionId: data.sessionId,
              senderType: oppositeSender,
              readAt: null,
            },
            { readAt: new Date() }
          );
          io.to(`session:${data.sessionId}`).emit('message-read', data);
          io.to('admin').emit('message-read', data);
        } catch (err) {
          console.error('message-read error:', err);
        }
      }
    );

    socket.on('disconnect', () => {
      console.log(`❌ Socket disconnected: ${socket.id}`);
    });
  });
}
