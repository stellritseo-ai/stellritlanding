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

// ── Project schema ──────────────────────────────────────────────────────────
const ProjectSchema = new mongoose.Schema(
  {
    clientName: { type: String, required: true },
    projectName: { type: String, required: true },
    businessName: { type: String, default: "" },
    salesDate: { type: String, default: "" },
    ownerName: { type: String, default: "" },
    domainName: { type: String, default: "" },
    phoneNumber: { type: String, default: "" },
    projectCost: { type: Number, default: 0 },
    accountSetup: { type: Number, default: 0 },
    firstInstallment: { type: Number, default: 0 },
    secondInstallment: { type: Number, default: 0 },
    thirdInstallment: { type: Number, default: 0 },
    hostingFee: { type: Number, default: 0 },
    closeBy: { type: String, default: "" },
    cardDetails: { type: String, default: "" },
    projectDetails: { type: String, default: "" },
    isCompleted: { type: Boolean, default: false },
    color: { type: String, default: "from-purple-500 to-indigo-500" },
  },
  { timestamps: true }
);

export const ProjectModel =
  mongoose.models.Project ||
  mongoose.model("Project", ProjectSchema);

// ── Task schema ─────────────────────────────────────────────────────────────
const TaskSchema = new mongoose.Schema(
  {
    title: { type: String, required: true },
    projectName: { type: String, default: "" },
    businessName: { type: String, default: "" },
    assignedUsers: { type: [String], default: [] },
    priority: { type: String, enum: ["Low", "Medium", "High", "Urgent"], default: "Medium" },
    status: { type: String, enum: ["To Do", "Ongoing", "Done", "Work Failed", "Domain Book"], default: "To Do" },
    tags: { type: [String], default: [] },
    description: { type: String, default: "" },
    businessInfo: {
      businessName: { type: String, default: "" },
      contactPerson: { type: String, default: "" },
      phoneNumber: { type: String, default: "" },
      email: { type: String, default: "" },
      website: { type: String, default: "" },
      requirements: { type: [String], default: [] }
    },
    domainInfo: {
      domainName: { type: String, default: "" }
    },
    attachments: [
      {
        name: { type: String, required: true },
        url: { type: String, required: true },
        type: { type: String }
      }
    ],
    checklist: [
      {
        text: { type: String, required: true },
        completed: { type: Boolean, default: false }
      }
    ],
    comments: [
      {
        id: { type: String, required: true },
        userId: { type: String, required: true },
        userName: { type: String, required: true },
        userAvatar: { type: String, default: "" },
        content: { type: String, required: true },
        createdAt: { type: Date, default: Date.now }
      }
    ],
    activityHistory: [
      {
        action: { type: String, required: true },
        performedBy: { type: String, required: true },
        timestamp: { type: Date, default: Date.now }
      }
    ],
    relatedProjectId: { type: String, default: "" },
    createdBy: { type: String, default: "" },
    orderIndex: { type: Number, default: 0 }
  },
  { timestamps: true }
);

export const TaskModel =
  mongoose.models.Task ||
  mongoose.model("Task", TaskSchema);

// ── Site Page schema ────────────────────────────────────────────────────────
const SitePageSchema = new mongoose.Schema(
  {
    path: { type: String, required: true, unique: true },
    title: { type: String, required: true },
    status: { type: String, enum: ["Published", "Draft"], default: "Draft" },
    speedScore: { type: Number, default: 0 }
  },
  { timestamps: true }
);

export const SitePageModel =
  mongoose.models.SitePage ||
  mongoose.model("SitePage", SitePageSchema);

// ── Site Config schema ──────────────────────────────────────────────────────
const SiteConfigSchema = new mongoose.Schema(
  {
    productionUrl: { type: String, default: "stellrit.com" },
    avgSeoRank: { type: String, default: "#4 Sector Avg" },
    keywordsTracked: { type: Number, default: 42 },
    coreWebVitals: { type: Number, default: 96 },
    maintenanceMode: { type: Boolean, default: false },
    aiHelpdeskAutoplay: { type: Boolean, default: true },
    edgeCacheCompression: { type: Boolean, default: true },
    dynamicCaseStudies: { type: Boolean, default: false }
  },
  { timestamps: true }
);

export const SiteConfigModel =
  mongoose.models.SiteConfig ||
  mongoose.model("SiteConfig", SiteConfigSchema);

// ── Asset Request schema ────────────────────────────────────────────────────
const AssetRequestSchema = new mongoose.Schema(
  {
    token: { type: String, required: true, unique: true, index: true },
    businessName: { type: String, required: true },
    clientName: { type: String },
    email: { type: String },
    phone: { type: String },
    notes: { type: String },
    relatedProjectId: { type: String },
    maxUploadSize: { type: Number, default: 104857600 },
    allowedFileTypes: { type: [String], default: ["images", "videos", "documents"] },
    expirationDate: { type: Date },
    status: { type: String, default: "Waiting for Upload", enum: ["Waiting for Upload", "Completed", "Expired"] },
  },
  { timestamps: true }
);

export const AssetRequestModel =
  mongoose.models.AssetRequest ||
  mongoose.model("AssetRequest", AssetRequestSchema);

// ── Uploaded Asset schema ───────────────────────────────────────────────────
const UploadedAssetSchema = new mongoose.Schema(
  {
    requestId: { type: String, index: true },
    businessName: { type: String, required: true },
    clientName: { type: String },
    email: { type: String },
    phone: { type: String },
    originalFilename: { type: String, required: true },
    fileType: { type: String, required: true, enum: ["image", "video", "document"] },
    mimeType: { type: String },
    fileSize: { type: Number, required: true },
    cloudinaryPublicId: { type: String },
    cloudinaryUrl: { type: String, required: true },
    status: { type: String, default: "Completed", enum: ["Completed", "Failed"] },
    notes: { type: String },
    uploadedBy: { type: String, default: "client_portal" },
  },
  { timestamps: true }
);

export const UploadedAssetModel =
  mongoose.models.UploadedAsset ||
  mongoose.model("UploadedAsset", UploadedAssetSchema);

// ── Operator schema ─────────────────────────────────────────────────────────
const OperatorSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    role: { type: String, enum: ["Super Admin", "Supervisor", "Manager", "Developer", "Viewer"], default: "Developer" },
    status: { type: String, enum: ["Active", "Inactive"], default: "Active" },
    joinedDate: { type: String, required: true },
    username: { type: String },
    password: { type: String },
    sessionToken: { type: String, default: "" }
  },
  { timestamps: true }
);

if (mongoose.models.Operator) {
  delete (mongoose.models as any).Operator;
}
export const OperatorModel = mongoose.model("Operator", OperatorSchema);

// ── Website Email schema ───────────────────────────────────────────────────
const WebsiteEmailSchema = new mongoose.Schema(
  {
    name: { type: String },
    email: { type: String, required: true },
    phone: { type: String },
    company: { type: String },
    service: { type: String },
    budget: { type: String },
    message: { type: String },
    type: { type: String, enum: ["contact", "newsletter"], required: true },
    submittedAt: { type: String, required: true },
  },
  { timestamps: true }
);

export const WebsiteEmailModel =
  mongoose.models.WebsiteEmail ||
  mongoose.model("WebsiteEmail", WebsiteEmailSchema);

// ── Activity Log schema ──────────────────────────────────────────────────────
const ActivityLogSchema = new mongoose.Schema(
  {
    action: { type: String, required: true },
    details: { type: String },
    performedBy: { type: String, required: true },
    timestamp: { type: Date, default: Date.now },
  },
  { timestamps: true }
);

if (mongoose.models.ActivityLog) {
  delete (mongoose.models as any).ActivityLog;
}
export const ActivityLogModel = mongoose.model("ActivityLog", ActivityLogSchema);

// ── Visitor Log schema ───────────────────────────────────────────────────────
const VisitorLogSchema = new mongoose.Schema(
  {
    ipAddress: { type: String, default: "127.0.0.1" },
    userAgent: { type: String, default: "Mozilla/5.0" },
    converted: { type: Boolean, default: false },
  },
  { timestamps: true }
);

if (mongoose.models.VisitorLog) {
  delete (mongoose.models as any).VisitorLog;
}
export const VisitorLogModel = mongoose.model("VisitorLog", VisitorLogSchema);

