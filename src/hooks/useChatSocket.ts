import { useEffect, useRef, useCallback } from 'react';

const CHAT_API_URL = import.meta.env.VITE_CHAT_API_URL ?? 'http://localhost:3001';

export interface ChatMessagePayload {
  id: string;
  sessionId: string;
  senderType: 'visitor' | 'admin';
  message: string;
  createdAt: string;
  readAt: string | null;
}

export interface TypingPayload {
  sessionId: string;
  senderType: 'visitor' | 'admin';
}

export interface SessionPayload {
  id: string;
  visitorId: string;
  visitorName: string;
  visitorPhoneOrEmail: string;
  status: 'open' | 'closed';
  createdAt: string;
  updatedAt: string;
}

export interface SessionUpdatedPayload {
  id: string;
  status: 'open' | 'closed';
}

interface UseChatSocketOptions {
  onMessage?: (data: ChatMessagePayload) => void;
  onTypingStart?: (data: TypingPayload) => void;
  onTypingStop?: (data: TypingPayload) => void;
  onMessageRead?: (data: { sessionId: string; readBy: 'visitor' | 'admin' }) => void;
  onSessionCreated?: (data: SessionPayload) => void;
  onSessionUpdated?: (data: SessionUpdatedPayload) => void;
}

interface UseChatSocketResult {
  joinChat: (sessionId: string) => void;
  joinAdmin: () => void;
  joinSession: (sessionId: string) => void;
  leaveSession: (sessionId: string) => void;
  emitTypingStart: (sessionId: string, senderType: 'visitor' | 'admin') => void;
  emitTypingStop: (sessionId: string, senderType: 'visitor' | 'admin') => void;
  markRead: (sessionId: string, readBy: 'visitor' | 'admin') => void;
  isConnected: () => boolean;
}

export function useChatSocket(options: UseChatSocketOptions = {}): UseChatSocketResult {
  const eventSourceRef = useRef<EventSource | null>(null);
  const connectedRef = useRef(false);
  const optionsRef = useRef(options);
  optionsRef.current = options;

  // Called when we have a sessionId (visitor) or role=admin
  const connect = useCallback((role: 'visitor' | 'admin', sessionId?: string) => {
    if (eventSourceRef.current) {
      eventSourceRef.current.close();
      eventSourceRef.current = null;
    }

    const url = new URL(`${CHAT_API_URL}/api/stream`);
    url.searchParams.set('role', role);
    if (sessionId) url.searchParams.set('sessionId', sessionId);

    const es = new EventSource(url.toString());
    eventSourceRef.current = es;

    es.onopen = () => {
      connectedRef.current = true;
    };

    es.onerror = () => {
      connectedRef.current = false;
    };

    es.onmessage = (event: MessageEvent) => {
      try {
        const parsed = JSON.parse(event.data) as { type: string; data: any };

        switch (parsed.type) {
          case 'connected':
            connectedRef.current = true;
            break;
          case 'new-message':
            optionsRef.current.onMessage?.(parsed.data as ChatMessagePayload);
            break;
          case 'typing-start':
            optionsRef.current.onTypingStart?.(parsed.data as TypingPayload);
            break;
          case 'typing-stop':
            optionsRef.current.onTypingStop?.(parsed.data as TypingPayload);
            break;
          case 'message-read':
            optionsRef.current.onMessageRead?.(parsed.data);
            break;
          case 'session-created':
            optionsRef.current.onSessionCreated?.(parsed.data as SessionPayload);
            break;
          case 'session-updated':
            optionsRef.current.onSessionUpdated?.(parsed.data as SessionUpdatedPayload);
            break;
        }
      } catch {
        // Ignore parse errors
      }
    };

    return () => {
      es.close();
      eventSourceRef.current = null;
      connectedRef.current = false;
    };
  }, []);

  useEffect(() => {
    return () => {
      eventSourceRef.current?.close();
      eventSourceRef.current = null;
      connectedRef.current = false;
    };
  }, []);

  // ─── Actions ───────────────────────────────────────────────────────────────

  // Visitor joins a specific chat session
  const joinChat = useCallback(
    (sessionId: string) => {
      connect('visitor', sessionId);
    },
    [connect]
  );

  // Admin joins the admin stream (sees all sessions)
  const joinAdmin = useCallback(() => {
    connect('admin');
  }, [connect]);

  // joinSession / leaveSession kept for API compatibility but SSE handles this via connect
  const joinSession = useCallback(
    (sessionId: string) => {
      connect('admin');
    },
    [connect]
  );

  const leaveSession = useCallback((_sessionId: string) => {
    // No-op for SSE — admin stays connected to the global stream
  }, []);

  const emitTypingStart = useCallback(
    (sessionId: string, senderType: 'visitor' | 'admin') => {
      fetch(`${CHAT_API_URL}/api/chat/typing`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ sessionId, senderType, isTyping: true }),
      }).catch(() => {});
    },
    []
  );

  const emitTypingStop = useCallback(
    (sessionId: string, senderType: 'visitor' | 'admin') => {
      fetch(`${CHAT_API_URL}/api/chat/typing`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ sessionId, senderType, isTyping: false }),
      }).catch(() => {});
    },
    []
  );

  const markRead = useCallback(
    (sessionId: string, readBy: 'visitor' | 'admin') => {
      fetch(`${CHAT_API_URL}/api/chat/read`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ sessionId, readBy }),
      }).catch(() => {});
    },
    []
  );

  const isConnected = useCallback(() => connectedRef.current, []);

  return {
    joinChat,
    joinAdmin,
    joinSession,
    leaveSession,
    emitTypingStart,
    emitTypingStop,
    markRead,
    isConnected,
  };
}
