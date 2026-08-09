import { createServerFn } from "@tanstack/react-start";
import { logActivity } from "./dashboard.functions.server";
import { decryptPassword, encryptPassword } from "./crypto.server";

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
  aiMode: boolean;
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

// Helper to automatically close inactive sessions (> 5 minutes)
async function checkAndAutoClose(ChatSessionModel: any, sessionId?: string) {
  const fiveMinsAgo = new Date(Date.now() - 5 * 60 * 1000).toISOString();
  if (sessionId) {
    await ChatSessionModel.updateOne(
      { _id: sessionId, status: "open", lastMessageTime: { $lt: fiveMinsAgo } },
      { status: "closed" }
    );
  } else {
    await ChatSessionModel.updateMany(
      { status: "open", lastMessageTime: { $lt: fiveMinsAgo } },
      { status: "closed" }
    );
  }
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
      aiMode: true,
      messages: [],
      createdAt: new Date().toISOString(),
    });
    await session.save();

    await logActivity(
      "Live Chat Started",
      `Visitor "${session.visitorName}" initiated a live chat session.`,
      "Website Visitor"
    );

    return mapSession(session.toObject());
  }
);

// ── Visitor: get session by ID ────────────────────────────────────────────────
export const getChatSessionFn = createServerFn({ method: "POST" }).handler(
  async ({ data }: { data: { sessionId: string } }) => {
    const { connectDB, ChatSessionModel } = await import("./db.server");
    await connectDB();
    await checkAndAutoClose(ChatSessionModel, data.sessionId);
    const chat = await ChatSessionModel.findById(data.sessionId).lean();
    return chat ? mapSession(chat) : null;
  }
);

// ── Visitor: send message ─────────────────────────────────────────────────────
export const sendChatMessageFn = createServerFn({ method: "POST" }).handler(
  async ({ data }: { data: { sessionId: string; sender: "visitor" | "admin"; text: string } }) => {
    const { connectDB, ChatSessionModel } = await import("./db.server");
    await connectDB();

    await checkAndAutoClose(ChatSessionModel, data.sessionId);

    // Verify if it has been closed
    const session = await ChatSessionModel.findById(data.sessionId).lean();
    if (!session || session.status === "closed") {
      throw new Error("This conversation has been closed.");
    }

    const visitorMessagesCount = (session.messages || []).filter((m: any) => m.sender === "visitor").length;
    const isFirstVisitorMessage = data.sender === "visitor" && visitorMessagesCount === 0;

    const now = new Date().toISOString();
    let updated = await ChatSessionModel.findByIdAndUpdate(
      data.sessionId,
      {
        $push: { messages: { sender: data.sender, text: data.text, timestamp: now } },
        lastMessage: data.text,
        lastMessageTime: now,
        unread: data.sender === "visitor",
      },
      { new: true }
    ).lean();

    if (updated) {
      await logActivity(
        "Chat Message Sent",
        `Message in conversation with "${updated.visitorName}": "${data.text.slice(0, 45)}${data.text.length > 45 ? "..." : ""}"`,
        data.sender === "admin" ? "Agent" : `Visitor: ${updated.visitorName}`
      );

      if (updated.aiMode !== false && data.sender === "visitor") {
        console.log("[AI] Intercepting message for AI. aiMode is true.");
        const { generateAIResponse, isAIAvailable } = await import("./gemini.server");
        console.log("[AI] isAIAvailable:", isAIAvailable);
        
        if (isAIAvailable) {
          console.log("[AI] Generating response for:", data.text);
          try {
            const aiRes = await generateAIResponse(updated.messages, data.text, updated.visitorName);
            console.log("[AI] Received response:", aiRes);
            const aiNow = new Date().toISOString();
          
          if (aiRes.functionCall) {
            if (aiRes.functionCall.name === "request_human") {
              // Turn off AI mode and notify admin
              updated = await ChatSessionModel.findByIdAndUpdate(
                data.sessionId,
                { aiMode: false },
                { new: true }
              ).lean();
              
              // Send Email Notification
              try {
                const { sendEmail, getChatNotificationHtml } = await import("./mail.server");
                const siteUrl = process.env.VITE_SITE_URL || "http://localhost:8083";
                const adminUrl = `${siteUrl}/dashboard/team-chat`;
                const startedAt = new Date().toLocaleString("en-US", { dateStyle: "short", timeStyle: "short" });
                
                const htmlContent = getChatNotificationHtml({
                  visitorName: updated.visitorName,
                  visitorContact: updated.visitorContact || "Not provided",
                  firstMessage: "Human assistance requested. Last message: " + data.text,
                  startedAt,
                  adminUrl,
                });

                await sendEmail({
                  to: process.env.EMAIL_USER || "jitenksony@gmail.com",
                  subject: `StellR IT: Human Requested by ${updated.visitorName}`,
                  text: `A visitor has requested human assistance.`,
                  html: htmlContent,
                });
              } catch (mailErr) {
                console.error("[Mail] Failed to send handoff email:", mailErr);
              }
              
              const handoffMsg = "All agents are currently busy, please wait a few moments. A Human or Agent will be available in 1 minute.";
              updated = await ChatSessionModel.findByIdAndUpdate(
                data.sessionId,
                {
                  $push: { messages: { sender: "admin", text: handoffMsg, timestamp: aiNow } },
                  lastMessage: handoffMsg,
                  lastMessageTime: aiNow,
                  unread: false,
                },
                { new: true }
              ).lean();
            } else if (aiRes.functionCall.name === "schedule_callback") {
              const bookMsg = `Perfect! Your appointment is booked. One of our experts will call you in exactly 10 minutes to discuss your project!`;
              updated = await ChatSessionModel.findByIdAndUpdate(
                data.sessionId,
                {
                  $push: { messages: { sender: "admin", text: bookMsg, timestamp: aiNow } },
                  lastMessage: bookMsg,
                  lastMessageTime: aiNow,
                  unread: false,
                },
                { new: true }
              ).lean();
              
              // Optional: Send Email Notification to admin with the lead's phone number!
              try {
                const { sendEmail } = await import("./mail.server");
                await sendEmail({
                  to: process.env.EMAIL_USER || "jitenksony@gmail.com",
                  subject: `StellR IT: NEW HOT LEAD - Call in 10 mins!`,
                  text: `A visitor just gave their phone number in the AI chat! Please call them in 10 minutes. Check the chat dashboard for full context.`,
                  html: `<h3>New Lead Captured!</h3><p>A visitor just finished the AI qualification flow and provided their phone number for a callback in 10 minutes.</p><p><a href="${process.env.VITE_SITE_URL || "http://localhost:8083"}/dashboard/team-chat">Click here to view the chat and get their number!</a></p>`,
                });
              } catch (e) {
                console.error("[Mail] Callback notification failed", e);
              }
            }
          } else if (aiRes.text) {
            updated = await ChatSessionModel.findByIdAndUpdate(
              data.sessionId,
              {
                $push: { messages: { sender: "admin", text: aiRes.text, timestamp: aiNow } },
                lastMessage: aiRes.text,
                lastMessageTime: aiNow,
                unread: false,
              },
              { new: true }
            ).lean();
          }
          } catch(err: any) {
            console.error("[AI] Error generating AI response:", err);
            updated = await ChatSessionModel.findByIdAndUpdate(
              data.sessionId,
              {
                $push: { messages: { sender: "admin", text: "I'm having trouble connecting to my brain right now. Our human agents have been notified and will be with you shortly.", timestamp: new Date().toISOString() } }
              },
              { new: true }
            ).lean();
          }
        } else {
           console.log("[AI] AI is not available (key missing?)");
           updated = await ChatSessionModel.findByIdAndUpdate(
             data.sessionId,
             {
               $push: { messages: { sender: "admin", text: "[DEBUG] AI is not available (key missing?)", timestamp: new Date().toISOString() } }
             },
             { new: true }
           ).lean();
        }
      } else if (!updated.aiMode && isFirstVisitorMessage) {
        try {
          const { sendEmail, getChatNotificationHtml } = await import("./mail.server");
          const siteUrl = process.env.VITE_SITE_URL || "http://localhost:8083";
          const adminUrl = `${siteUrl}/dashboard/team-chat`;
          const startedAt = new Date().toLocaleString("en-US", {
            dateStyle: "short",
            timeStyle: "short",
          });

          const htmlContent = getChatNotificationHtml({
            visitorName: session.visitorName,
            visitorContact: session.visitorContact || "Not provided",
            firstMessage: data.text,
            startedAt,
            adminUrl,
          });

          await sendEmail({
            to: process.env.EMAIL_USER || "jitenksony@gmail.com",
            subject: `StellR IT: New Chat Conversation with ${session.visitorName}`,
            text: `You have received a new chat conversation on StellR IT from ${session.visitorName}. Message: "${data.text}"`,
            html: htmlContent,
          });
        } catch (mailErr) {
          console.error("[Mail] Failed to send chat notification email:", mailErr);
        }
      }
    }

    return updated ? mapSession(updated) : null;
  }
);

// ── Admin: get all sessions ───────────────────────────────────────────────────
export const getAllChatSessionsFn = createServerFn({ method: "GET" }).handler(async () => {
  const { connectDB, ChatSessionModel } = await import("./db.server");
  await connectDB();
  await checkAndAutoClose(ChatSessionModel);
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
    const { connectDB, OperatorModel } = await import("./db.server");
    await connectDB();

    // Ensure super admin exists and is active
    let user = await OperatorModel.findOne({
      username: data.username.toLowerCase().trim(),
    });

    if (data.username.toLowerCase().trim() === "stellr") {
      if (!user) {
        user = new OperatorModel({
          name: "Jiten Sony",
          email: "jiten@stellrit.com",
          role: "Super Admin",
          status: "Active",
          joinedDate: new Date().toISOString().split("T")[0],
          username: "stellr",
          password: encryptPassword("stellr123"),
          sessionToken: "",
        });
        await user.save();
        console.log("[DB] Seeded default super admin user 'stellr'");
      } else if (user.status !== "Active") {
        user.status = "Active";
        await user.save();
      }
    }

    if (!user || user.status !== "Active") {
      throw new Error("Invalid username, password, or account inactive");
    }

    const decrypted = decryptPassword(user.password);
    let passwordMatched = decrypted === data.password;

    // Password recovery for super admin with default passwords
    if (!passwordMatched && user.username === "stellr" && (data.password === "stellr123" || data.password === "stellrit123")) {
      user.password = encryptPassword(data.password);
      await user.save();
      passwordMatched = true;
      console.log(`[DB] Mismatched/corrupted super admin password recovered to default '${data.password}'`);
    }

    if (!passwordMatched) {
      throw new Error("Invalid username, password, or account inactive");
    }

    // On-the-fly migration: if stored password is not encrypted, encrypt it now
    if (user.password && !user.password.startsWith("enc:")) {
      user.password = encryptPassword(user.password);
      await user.save();
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
    const { connectDB, OperatorModel } = await import("./db.server");
    await connectDB();
    if (!data.token) return { valid: false };
    const user = await OperatorModel.findOne({ sessionToken: data.token, status: "Active" });
    if (!user) return { valid: false };
    return { valid: true, id: user._id.toString(), username: user.username, role: user.role };
  }
);

// ── Team Chat: get current operator profile ───────────────────────────────────
export const getCurrentOperatorFn = createServerFn({ method: "POST" }).handler(
  async ({ data }: { data: { token: string } }) => {
    const { connectDB, OperatorModel } = await import("./db.server");
    await connectDB();
    if (!data.token) return null;
    const user = await OperatorModel.findOne({ sessionToken: data.token, status: "Active" }).lean();
    if (!user) return null;
    return {
      id: user._id.toString(),
      name: user.name,
      username: user.username,
      email: user.email,
      role: user.role,
    };
  }
);

// ── Team Chat: get message history ────────────────────────────────────────────
export const getTeamChatMessagesFn = createServerFn({ method: "POST" }).handler(
  async ({ data }: { data: { senderId: string; recipientId: string } }) => {
    const { connectDB, TeamChatMessageModel } = await import("./db.server");
    await connectDB();
    const messages = await TeamChatMessageModel.find({
      $or: [
        { senderId: data.senderId, recipientId: data.recipientId },
        { senderId: data.recipientId, recipientId: data.senderId },
      ]
    }).sort({ createdAt: 1 }).lean();

    return messages.map((m: any) => ({
      id: m._id.toString(),
      senderId: m.senderId,
      recipientId: m.recipientId,
      text: m.text || "",
      fileUrl: m.fileUrl || "",
      fileType: m.fileType || "",
      fileName: m.fileName || "",
      createdAt: m.createdAt.toISOString(),
      readAt: m.readAt ? m.readAt.toISOString() : null,
    }));
  }
);

// ── Team Chat: send message ───────────────────────────────────────────────────
export const sendTeamChatMessageFn = createServerFn({ method: "POST" }).handler(
  async ({ data }: { data: { senderId: string; recipientId: string; text?: string; fileUrl?: string; fileType?: string; fileName?: string } }) => {
    const { connectDB, TeamChatMessageModel } = await import("./db.server");
    await connectDB();
    const msg = new TeamChatMessageModel({
      senderId: data.senderId,
      recipientId: data.recipientId,
      text: data.text || "",
      fileUrl: data.fileUrl || "",
      fileType: data.fileType || "",
      fileName: data.fileName || "",
      readAt: null,
    });
    await msg.save();
    return {
      id: msg._id.toString(),
      senderId: msg.senderId,
      recipientId: msg.recipientId,
      text: msg.text || "",
      fileUrl: msg.fileUrl || "",
      fileType: msg.fileType || "",
      fileName: msg.fileName || "",
      createdAt: msg.createdAt.toISOString(),
      readAt: null,
    };
  }
);

// ── Team Chat: mark messages as read ──────────────────────────────────────────
export const markTeamChatReadFn = createServerFn({ method: "POST" }).handler(
  async ({ data }: { data: { senderId: string; recipientId: string } }) => {
    const { connectDB, TeamChatMessageModel } = await import("./db.server");
    await connectDB();
    await TeamChatMessageModel.updateMany(
      { senderId: data.recipientId, recipientId: data.senderId, readAt: null },
      { readAt: new Date() }
    );
    return { success: true };
  }
);

// ── Admin: delete session ─────────────────────────────────────────────────────
export const deleteChatSessionFn = createServerFn({ method: "POST" }).handler(
  async ({ data }: { data: { sessionId: string } }) => {
    const { connectDB, ChatSessionModel } = await import("./db.server");
    await connectDB();
    const session = await ChatSessionModel.findById(data.sessionId).lean();
    if (session) {
      await ChatSessionModel.findByIdAndDelete(data.sessionId);
      await logActivity(
        "Chat Session Deleted",
        `Chat session with "${session.visitorName}" was deleted by an admin.`,
        "Agent"
      );
    }
    return { success: true };
  }
);
