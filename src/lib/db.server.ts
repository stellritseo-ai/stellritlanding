import mongoose from "mongoose";

let cached = (global as any).mongoose;
if (!cached) {
  cached = (global as any).mongoose = { conn: null, promise: null };
}

export async function connectDB() {
  if (cached.conn) return cached.conn;

  const MONGODB_URI =
    process.env.MONGODB_URI ||
    (import.meta.env as any).MONGODB_URI ||
    process.env.DATABASE_URL ||
    "";

  if (!MONGODB_URI) {
    throw new Error("Please define MONGODB_URI environment variable");
  }

  if (!cached.promise) {
    cached.promise = mongoose.connect(MONGODB_URI, { bufferCommands: false }).then((m) => {
      console.log("[DB] MongoDB connected");
      return m;
    });
  }
  try {
    cached.conn = await cached.promise;
  } catch (e) {
    cached.promise = null;
    throw e;
  }
  return cached.conn;
}

// ── Chat Message sub-schema ───────────────────────────────────────────────────
const ChatMessageSchema = new mongoose.Schema({
  sender: { type: String, enum: ["visitor", "admin"], required: true },
  text: { type: String, required: true },
  timestamp: { type: String, required: true },
});

// ── Chat Session schema ───────────────────────────────────────────────────────
const ChatSessionSchema = new mongoose.Schema({
  visitorName: { type: String, required: true },
  visitorContact: { type: String, default: "" }, // email or phone
  lastMessage: { type: String, default: "" },
  lastMessageTime: { type: String, required: true },
  unread: { type: Boolean, default: false },
  status: { type: String, enum: ["open", "closed"], default: "open" },
  messages: { type: [ChatMessageSchema], default: [] },
  createdAt: { type: String, required: true },
});

export const ChatSessionModel =
  mongoose.models.StellrChatSession ||
  mongoose.model("StellrChatSession", ChatSessionSchema);

// ── Admin User schema ─────────────────────────────────────────────────────────
const AdminUserSchema = new mongoose.Schema({
  username: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  name: { type: String, default: "" },
  role: { type: String, default: "admin" },
  sessionToken: { type: String, default: "" },
});

export const AdminUserModel =
  mongoose.models.StellrAdminUser ||
  mongoose.model("StellrAdminUser", AdminUserSchema);
