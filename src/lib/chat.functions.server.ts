import { createServerFn } from "@tanstack/react-start";

// ── Types (shared with client) ────────────────────────────────────────────────
export interface ChatMessage {
  id: string;
  sender: "visitor" | "admin";
  text: string;
  timestamp: string;
}

export interface ChatSession {
  id: string;
  visitorName: string;
  visitorContact: string;
  lastMessage: string;
  lastMessageTime: string;
  unread: boolean;
  status: "open" | "closed";
  messages: ChatMessage[];
  createdAt: string;
}

function mapSession(c: any): ChatSession {
  return {
    ...c,
    id: c._id ? c._id.toString() : c.id,
    _id: undefined,
    messages: (c.messages || []).map((m: any) => ({
      ...m,
      id: m._id ? m._id.toString() : m.id,
      _id: undefined,
    })),
  };
}

// ── Visitor: create session ───────────────────────────────────────────────────
export const createChatSessionFn = createServerFn({ method: "POST" }).handler(
  async ({ data }: { data: { visitorName: string; visitorContact: string } }) => {
    const { connectDB, ChatSessionModel } = await import("./db.server");
    await connectDB();

    const session = new ChatSessionModel({
      visitorName: data.visitorName,
      visitorContact: data.visitorContact || "",
      lastMessage: "Chat started",
      lastMessageTime: new Date().toISOString(),
      unread: false,
      status: "open",
      messages: [],
      createdAt: new Date().toISOString(),
    });
    await session.save();
    return mapSession(session.toObject());
  }
);

// ── Visitor: get session by ID ────────────────────────────────────────────────
export const getChatSessionFn = createServerFn({ method: "POST" }).handler(
  async ({ data }: { data: { sessionId: string } }) => {
    const { connectDB, ChatSessionModel } = await import("./db.server");
    await connectDB();
    const chat = await ChatSessionModel.findById(data.sessionId).lean();
    return chat ? mapSession(chat) : null;
  }
);

// ── Visitor: send message ─────────────────────────────────────────────────────
export const sendChatMessageFn = createServerFn({ method: "POST" }).handler(
  async ({ data }: { data: { sessionId: string; sender: "visitor" | "admin"; text: string } }) => {
    const { connectDB, ChatSessionModel } = await import("./db.server");
    await connectDB();

    const now = new Date().toISOString();
    const updated = await ChatSessionModel.findByIdAndUpdate(
      data.sessionId,
      {
        $push: { messages: { sender: data.sender, text: data.text, timestamp: now } },
        lastMessage: data.text,
        lastMessageTime: now,
        unread: data.sender === "visitor",
      },
      { new: true }
    ).lean();

    return updated ? mapSession(updated) : null;
  }
);

// ── Admin: get all sessions ───────────────────────────────────────────────────
export const getAllChatSessionsFn = createServerFn({ method: "GET" }).handler(async () => {
  const { connectDB, ChatSessionModel } = await import("./db.server");
  await connectDB();
  const chats = await ChatSessionModel.find().sort({ lastMessageTime: -1 }).lean();
  return chats.map(mapSession);
});

// ── Admin: mark session as read ───────────────────────────────────────────────
export const markChatReadFn = createServerFn({ method: "POST" }).handler(
  async ({ data }: { data: { sessionId: string } }) => {
    const { connectDB, ChatSessionModel } = await import("./db.server");
    await connectDB();
    await ChatSessionModel.findByIdAndUpdate(data.sessionId, { unread: false });
    return { success: true };
  }
);

// ── Admin: update session status ──────────────────────────────────────────────
export const updateChatStatusFn = createServerFn({ method: "POST" }).handler(
  async ({ data }: { data: { sessionId: string; status: "open" | "closed" } }) => {
    const { connectDB, ChatSessionModel } = await import("./db.server");
    await connectDB();
    const updated = await ChatSessionModel.findByIdAndUpdate(
      data.sessionId,
      { status: data.status },
      { new: true }
    ).lean();
    return updated ? mapSession(updated) : null;
  }
);

// ── Auth: login ───────────────────────────────────────────────────────────────
export const loginAdminFn = createServerFn({ method: "POST" }).handler(
  async ({ data }: { data: { username: string; password: string } }) => {
    const { connectDB, AdminUserModel } = await import("./db.server");
    await connectDB();

    // Seed default admin if none exists
    const count = await AdminUserModel.countDocuments();
    if (count === 0) {
      await new AdminUserModel({
        username: "stellr",
        password: "stellr123",
        name: "Jiten Sony",
        role: "admin",
        sessionToken: "",
      }).save();
    }

    const user = await AdminUserModel.findOne({
      username: data.username.toLowerCase().trim(),
    });
    if (!user || user.password !== data.password) {
      throw new Error("Invalid username or password");
    }

    // Generate token
    const array = new Uint8Array(32);
    globalThis.crypto.getRandomValues(array);
    const token = Array.from(array)
      .map((b) => b.toString(16).padStart(2, "0"))
      .join("");

    user.sessionToken = token;
    await user.save();
    return { success: true, token, name: user.name, role: user.role };
  }
);

// ── Auth: verify token ────────────────────────────────────────────────────────
export const verifyAdminTokenFn = createServerFn({ method: "POST" }).handler(
  async ({ data }: { data: { token: string } }) => {
    const { connectDB, AdminUserModel } = await import("./db.server");
    await connectDB();
    if (!data.token) return { valid: false };
    const user = await AdminUserModel.findOne({ sessionToken: data.token });
    if (!user) return { valid: false };
    return { valid: true, id: user._id.toString(), username: user.username, role: user.role };
  }
);
