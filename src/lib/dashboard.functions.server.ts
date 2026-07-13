import { createServerFn } from "@tanstack/react-start";
import crypto from "node:crypto";

// Helper to map mongoose documents to simple JS objects with string IDs
function mapDoc(d: any) {
  if (!d) return null;
  const obj = d.toObject ? d.toObject({ virtuals: true, getters: true }) : d;
  const json = JSON.parse(JSON.stringify(obj));
  return {
    ...json,
    id: obj._id ? obj._id.toString() : (obj.id || json.id || json._id),
    _id: undefined,
    __v: undefined,
  };
}

// Helper to log activities inside server actions
export async function logActivity(action: string, details: string, performedBy?: string) {
  try {
    const { connectDB, ActivityLogModel } = await import("./db.server");
    await connectDB();
    const log = new ActivityLogModel({
      action,
      details,
      performedBy: performedBy || "System Admin",
      timestamp: new Date()
    });
    await log.save();
  } catch (err) {
    console.error("[ActivityLog] Failed to log activity:", err);
  }
}

// ── Diagnostics ──────────────────────────────────────────────────────────────
export const getDiagnosticsFn = createServerFn({ method: "GET" }).handler(async () => {
  const { connectDB, UploadedAssetModel, VisitorLogModel, WebsiteEmailModel, ChatSessionModel } = await import("./db.server");
  const mongoose = (await import("mongoose")).default;
  await connectDB();

  const memory = process.memoryUsage();
  const dbStatus = mongoose.connection.readyState === 1 ? "Connected" : "Connecting...";

  // Query assets count and total footprint size
  const assetsCount = await UploadedAssetModel.countDocuments();
  const assetsSizeAgg = await UploadedAssetModel.aggregate([
    { $group: { _id: null, totalSize: { $sum: "$fileSize" } } }
  ]);
  const totalSize = assetsSizeAgg[0]?.totalSize || 0;

  // Visitor logs
  let totalVisitors = await VisitorLogModel.countDocuments();
  if (totalVisitors === 0) {
    const seedLogs = [];
    for (let i = 0; i < 480; i++) {
      seedLogs.push({
        ipAddress: `192.168.1.${Math.floor(Math.random() * 255)}`,
        userAgent: "Mozilla/5.0",
        converted: Math.random() < 0.15
      });
    }
    await VisitorLogModel.insertMany(seedLogs);
    totalVisitors = await VisitorLogModel.countDocuments();
  }

  const convertedEmails = await WebsiteEmailModel.countDocuments();
  const convertedChats = await ChatSessionModel.countDocuments();
  const totalConversions = convertedEmails + convertedChats;
  const conversionRate = totalVisitors > 0 ? (totalConversions / totalVisitors) * 100 : 0;

  return {
    cpuUsage: parseFloat((10 + Math.random() * 15).toFixed(1)), // mock active pool load
    heapUsed: memory.heapUsed,
    heapTotal: memory.heapTotal,
    uptime: Math.round(process.uptime()),
    databaseStatus: dbStatus,
    totalAssets: assetsCount,
    totalSize: totalSize,
    totalVisitors,
    totalConversions,
    conversionRate: parseFloat(conversionRate.toFixed(1))
  };
});

// ── Log Visitor Landed ────────────────────────────────────────────────────────
export const logVisitorFn = createServerFn({ method: "POST" }).handler(async () => {
  const { connectDB, VisitorLogModel } = await import("./db.server");
  await connectDB();

  const visitor = new VisitorLogModel({
    ipAddress: "127.0.0.1",
    userAgent: "Mozilla/5.0",
    converted: false
  });
  await visitor.save();
  return { success: true };
});


// ── Operators ────────────────────────────────────────────────────────────────
export const getOperatorsFn = createServerFn({ method: "GET" }).handler(async () => {
  const { connectDB, OperatorModel, SiteConfigModel } = await import("./db.server");
  await connectDB();

  let config = await SiteConfigModel.findOne();
  if (!config) {
    config = new SiteConfigModel();
    await config.save();
  }

  let ops = await OperatorModel.find().sort({ createdAt: 1 });

  if (!config.membersSeeded) {
    if (ops.length === 0) {
      const defaults = [
        { name: "Jiten Sony", email: "jiten@stellrit.com", role: "Super Admin", status: "Active", joinedDate: "2026-01-15", username: "stellr", password: "stellr123" },
        { name: "Sarah Jenkins", email: "sarah.j@nexus.io", role: "Supervisor", status: "Active", joinedDate: "2026-02-18", username: "sarah", password: "sarah123" },
        { name: "David Chen", email: "david.c@technova.com", role: "Developer", status: "Active", joinedDate: "2026-03-10", username: "david", password: "david123" },
        { name: "Alex Rivera", email: "alex@riveradesign.co", role: "Manager", status: "Active", joinedDate: "2026-04-05", username: "alex", password: "alex123" },
        { name: "Emily Watson", email: "emily.w@harmonycare.org", role: "Developer", status: "Active", joinedDate: "2026-04-10", username: "emily", password: "emily123" }
      ];
      await OperatorModel.insertMany(defaults);
      ops = await OperatorModel.find().sort({ createdAt: 1 });
    }
    config.membersSeeded = true;
    await config.save();
  }
  return ops.map(mapDoc);
});

export const createOperatorFn = createServerFn({ method: "POST" }).handler(
  async ({ data }: { data: any }) => {
    const { connectDB, OperatorModel } = await import("./db.server");
    await connectDB();
    const op = new OperatorModel(data);
    await op.save();

    await logActivity(
      "Member Registered",
      `${op.name} was registered as ${op.role}.`,
      "System Admin"
    );

    return mapDoc(op);
  }
);

export const updateOperatorStatusFn = createServerFn({ method: "POST" }).handler(
  async ({ data }: { data: { id: string; status: string } }) => {
    const { connectDB, OperatorModel } = await import("./db.server");
    await connectDB();
    const updated = await OperatorModel.findByIdAndUpdate(
      data.id,
      { status: data.status },
      { new: true }
    );

    if (updated) {
      await logActivity(
        "Member Status Shifted",
        `Operator seat for ${updated.name} is now ${data.status}.`,
        "System Admin"
      );
    }

    return mapDoc(updated);
  }
);

export const deleteOperatorFn = createServerFn({ method: "POST" }).handler(
  async ({ data }: { data: { id: string } }) => {
    const { connectDB, OperatorModel } = await import("./db.server");
    await connectDB();
    const op = await OperatorModel.findByIdAndDelete(data.id);

    if (op) {
      await logActivity(
        "Member Revoked",
        `Operator access for ${op.name} was revoked.`,
        "System Admin"
      );
    }

    return { success: true };
  }
);

// ── Site Configuration ───────────────────────────────────────────────────────
export const getSiteConfigFn = createServerFn({ method: "GET" }).handler(async () => {
  const { connectDB, SiteConfigModel } = await import("./db.server");
  await connectDB();

  let config = await SiteConfigModel.findOne({});
  if (!config) {
    config = await SiteConfigModel.create({
      productionUrl: "stellrit.com",
      avgSeoRank: "#4 Sector Avg",
      keywordsTracked: 42,
      coreWebVitals: 96,
      maintenanceMode: false,
      aiHelpdeskAutoplay: true,
      edgeCacheCompression: true,
      dynamicCaseStudies: false,
      projectsSeeded: false
    });
  }
  return mapDoc(config);
});

export const updateSiteConfigFn = createServerFn({ method: "POST" }).handler(
  async ({ data }: { data: any }) => {
    const { connectDB, SiteConfigModel } = await import("./db.server");
    await connectDB();
    const updated = await SiteConfigModel.findOneAndUpdate({}, data, { new: true, upsert: true });
    return mapDoc(updated);
  }
);

// ── Site Pages ───────────────────────────────────────────────────────────────
export const getSitePagesFn = createServerFn({ method: "GET" }).handler(async () => {
  const { connectDB, SitePageModel } = await import("./db.server");
  await connectDB();

  let pages = await SitePageModel.find().sort({ createdAt: 1 });
  if (pages.length === 0) {
    const defaults = [
      { path: "/", title: "Homepage — StellR IT", status: "Published", speedScore: 98 },
      { path: "/about", title: "About Us — StellR IT", status: "Published", speedScore: 96 },
      { path: "/services", title: "Services — StellR IT", status: "Published", speedScore: 94 },
      { path: "/contact", title: "Contact — StellR IT", status: "Published", speedScore: 97 },
      { path: "/insights", title: "Insights — StellR IT", status: "Draft", speedScore: 0 }
    ];
    await SitePageModel.insertMany(defaults);
    pages = await SitePageModel.find().sort({ createdAt: 1 });
  }
  return pages.map(mapDoc);
});

export const createSitePageFn = createServerFn({ method: "POST" }).handler(
  async ({ data }: { data: any }) => {
    const { connectDB, SitePageModel } = await import("./db.server");
    await connectDB();
    const page = new SitePageModel(data);
    await page.save();
    return mapDoc(page);
  }
);

export const updateSitePageFn = createServerFn({ method: "POST" }).handler(
  async ({ data }: { data: { id: string; update: any } }) => {
    const { connectDB, SitePageModel } = await import("./db.server");
    await connectDB();
    const updated = await SitePageModel.findByIdAndUpdate(data.id, data.update, { new: true });
    return mapDoc(updated);
  }
);

export const deleteSitePageFn = createServerFn({ method: "POST" }).handler(
  async ({ data }: { data: { id: string } }) => {
    const { connectDB, SitePageModel } = await import("./db.server");
    await connectDB();
    await SitePageModel.findByIdAndDelete(data.id);
    return { success: true };
  }
);

// ── Projects CRUD ────────────────────────────────────────────────────────────
export const getProjectsFn = createServerFn({ method: "GET" }).handler(async () => {
  const { connectDB, ProjectModel, SiteConfigModel } = await import("./db.server");
  await connectDB();
  let list = await ProjectModel.find().sort({ createdAt: -1 });

  let config = await SiteConfigModel.findOne({});
  if (!config) {
    config = await SiteConfigModel.create({
      productionUrl: "stellrit.com",
      avgSeoRank: "#4 Sector Avg",
      keywordsTracked: 42,
      coreWebVitals: 96,
      maintenanceMode: false,
      aiHelpdeskAutoplay: true,
      edgeCacheCompression: true,
      dynamicCaseStudies: false,
      projectsSeeded: false
    });
  }

  if (list.length === 0 && !config.projectsSeeded) {
    const { encryptPassword } = await import("./crypto.server");
    const seedProjects = [
      {
        clientName: "Acme Corp",
        projectName: "Enterprise Site Redesign",
        email: "billing@acme.com",
        businessName: "Acme Industries",
        salesDate: "2026-06-10",
        ownerName: "Jiten Sony",
        domainName: "acme.com",
        phoneNumber: "9876543210",
        projectCost: 15000,
        accountSetup: 3000,
        firstInstallment: 4000,
        secondInstallment: 4000,
        thirdInstallment: 4000,
        hostingFee: 150,
        closeBy: "2026-07-15",
        cardDetails: encryptPassword("Visa **** 4242"),
        projectDetails: "Complete migration to Next.js and Tailwind CSS.",
        isCompleted: false,
        color: "from-purple-500 to-indigo-500",
        createdAt: new Date("2026-06-10T12:00:00Z")
      },
      {
        clientName: "Nova Spark",
        projectName: "SaaS Application Platform",
        email: "admin@novaspark.io",
        businessName: "Nova Spark LLC",
        salesDate: "2026-06-05",
        ownerName: "David Chen",
        domainName: "novaspark.io",
        phoneNumber: "9812345678",
        projectCost: 28000,
        accountSetup: 7000,
        firstInstallment: 7000,
        secondInstallment: 7000,
        thirdInstallment: 7000,
        hostingFee: 250,
        closeBy: "2026-08-30",
        cardDetails: encryptPassword("MasterCard **** 8888"),
        projectDetails: "AI workflow orchestrator dashboard development.",
        isCompleted: true,
        color: "from-emerald-500 to-teal-500",
        createdAt: new Date("2026-06-05T10:00:00Z")
      },
      {
        clientName: "Green Life",
        projectName: "E-Commerce Market Showcase",
        email: "orders@greenlife.market",
        businessName: "Green Life Organic",
        salesDate: "2026-05-20",
        ownerName: "Alex Rivera",
        domainName: "greenlife.market",
        phoneNumber: "9845678123",
        projectCost: 12000,
        accountSetup: 3000,
        firstInstallment: 3000,
        secondInstallment: 3000,
        thirdInstallment: 3000,
        hostingFee: 99,
        closeBy: "2026-06-25",
        cardDetails: encryptPassword("Amex **** 1007"),
        projectDetails: "Shopify headless storefront setup with search engine tuning.",
        isCompleted: true,
        color: "from-amber-500 to-orange-500",
        createdAt: new Date("2025-05-20T14:30:00Z")
      },
      {
        clientName: "Apex Fit",
        projectName: "Fitness Tracking Mobile Hub",
        email: "accounts@apexfit.app",
        businessName: "Apex Fitness Inc",
        salesDate: "2026-05-12",
        ownerName: "Sarah Jenkins",
        domainName: "apexfit.app",
        phoneNumber: "9809876543",
        projectCost: 22000,
        accountSetup: 5000,
        firstInstallment: 5000,
        secondInstallment: 5000,
        thirdInstallment: 5000,
        hostingFee: 199,
        closeBy: "2026-07-20",
        cardDetails: encryptPassword("Visa **** 9911"),
        projectDetails: "Cross-platform mobile application design and deployment.",
        isCompleted: false,
        color: "from-pink-500 to-rose-500",
        createdAt: new Date("2025-05-12T09:15:00Z")
      }
    ];
    await ProjectModel.insertMany(seedProjects);
    config.projectsSeeded = true;
    await config.save();
    list = await ProjectModel.find().sort({ createdAt: -1 });
  }
  const { decryptPassword } = await import("./crypto.server");
  return list.map((doc) => {
    const plain = mapDoc(doc);
    if (plain && plain.cardDetails) {
      plain.cardDetails = decryptPassword(plain.cardDetails);
    }
    return plain;
  });
});

export const createProjectFn = createServerFn({ method: "POST" }).handler(
  async ({ data }: { data: any }) => {
    const { connectDB, ProjectModel } = await import("./db.server");
    const { encryptPassword, decryptPassword } = await import("./crypto.server");
    await connectDB();
    if (data && data.cardDetails) {
      data.cardDetails = encryptPassword(data.cardDetails);
    }
    const proj = new ProjectModel(data);
    await proj.save();

    await logActivity(
      "Project Provisioned",
      `Project "${proj.email || proj.projectName || "Unnamed"}" was created for ${proj.clientName}.`,
      "System Admin"
    );

    const plain = mapDoc(proj);
    if (plain && plain.cardDetails) {
      plain.cardDetails = decryptPassword(plain.cardDetails);
    }
    return plain;
  }
);

export const updateProjectFn = createServerFn({ method: "POST" }).handler(
  async ({ data }: { data: { id: string; update: any } }) => {
    const { connectDB, ProjectModel } = await import("./db.server");
    const { encryptPassword, decryptPassword } = await import("./crypto.server");
    await connectDB();
    if (data && data.update && data.update.cardDetails) {
      data.update.cardDetails = encryptPassword(data.update.cardDetails);
    }
    const updated = await ProjectModel.findByIdAndUpdate(data.id, data.update, { new: true });

    if (updated) {
      await logActivity(
        "Project Updated",
        `Project "${updated.email || updated.projectName || "Unnamed"}" details were modified.`,
        "System Admin"
      );
    }

    const plain = mapDoc(updated);
    if (plain && plain.cardDetails) {
      plain.cardDetails = decryptPassword(plain.cardDetails);
    }
    return plain;
  }
);

export const deleteProjectFn = createServerFn({ method: "POST" }).handler(
  async ({ data }: { data: { id: string } }) => {
    const { connectDB, ProjectModel } = await import("./db.server");
    await connectDB();
    const proj = await ProjectModel.findByIdAndDelete(data.id);

    if (proj) {
      await logActivity(
        "Project Revoked",
        `Project "${proj.email || proj.projectName || "Unnamed"}" was permanently removed.`,
        "System Admin"
      );
    }

    return { success: true };
  }
);

// ── Tasks CRUD ───────────────────────────────────────────────────────────────
export const getTasksFn = createServerFn({ method: "GET" }).handler(async () => {
  try {
    const { connectDB, TaskModel } = await import("./db.server");
    await connectDB();
    const list = await TaskModel.find().sort({ orderIndex: 1, createdAt: -1 });
    return list.map(mapDoc);
  } catch (err: any) {
    console.error("Error in getTasksFn:", err);
    throw new Error(err.message || "Failed to fetch task list.");
  }
});

export const createTaskFn = createServerFn({ method: "POST" }).handler(
  async ({ data }: { data: any }) => {
    try {
      const { connectDB, TaskModel } = await import("./db.server");
      await connectDB();
      const task = new TaskModel(data);
      await task.save();

      await logActivity(
        "Task Created",
        `Task "${task.title}" was provisioned.`,
        "System Admin"
      );

      return mapDoc(task);
    } catch (err: any) {
      console.error("Error in createTaskFn:", err);
      throw new Error(err.message || "Failed to create task card.");
    }
  }
);

export const updateTaskFn = createServerFn({ method: "POST" }).handler(
  async ({ data }: { data: { id: string; update: any } }) => {
    try {
      const { connectDB, TaskModel } = await import("./db.server");
      await connectDB();
      const updated = await TaskModel.findByIdAndUpdate(data.id, data.update, { new: true });

      if (updated) {
        await logActivity(
          "Task Updated",
          `Task "${updated.title}" status shifted to "${updated.status}".`,
          "System Admin"
        );
      }

      return mapDoc(updated);
    } catch (err: any) {
      console.error("Error in updateTaskFn:", err);
      throw new Error(err.message || "Failed to update task.");
    }
  }
);

export const deleteTaskFn = createServerFn({ method: "POST" }).handler(
  async ({ data }: { data: { id: string } }) => {
    try {
      const { connectDB, TaskModel } = await import("./db.server");
      await connectDB();
      const task = await TaskModel.findByIdAndDelete(data.id);

      if (task) {
        await logActivity(
          "Task Deleted",
          `Task "${task.title}" was permanently removed.`,
          "System Admin"
        );
      }

      return { success: true };
    } catch (err: any) {
      console.error("Error in deleteTaskFn:", err);
      throw new Error(err.message || "Failed to delete task.");
    }
  }
);

// ── Asset Portals / Requests ────────────────────────────────────────────────
export const getAssetRequestsFn = createServerFn({ method: "GET" }).handler(async () => {
  const { connectDB, AssetRequestModel } = await import("./db.server");
  await connectDB();
  const list = await AssetRequestModel.find().sort({ createdAt: -1 });
  return list.map(mapDoc);
});

export const createAssetRequestFn = createServerFn({ method: "POST" }).handler(
  async ({ data }: { data: any }) => {
    const { connectDB, AssetRequestModel } = await import("./db.server");
    await connectDB();

    // Generate random 16-char token for secure upload URL link
    const token = crypto.randomBytes(8).toString("hex");

    const req = new AssetRequestModel({
      ...data,
      token,
      status: "Waiting for Upload",
    });
    await req.save();
    return mapDoc(req);
  }
);

export const getAssetRequestByTokenFn = createServerFn({ method: "POST" }).handler(
  async ({ data }: { data: { token: string } }) => {
    const { connectDB, AssetRequestModel } = await import("./db.server");
    await connectDB();
    const req = await AssetRequestModel.findOne({ token: data.token });
    return req ? mapDoc(req) : null;
  }
);

export const deleteAssetRequestFn = createServerFn({ method: "POST" }).handler(
  async ({ data }: { data: { id: string } }) => {
    const { connectDB, AssetRequestModel } = await import("./db.server");
    await connectDB();
    await AssetRequestModel.findByIdAndDelete(data.id);
    return { success: true };
  }
);

// ── Uploaded Assets Management ──────────────────────────────────────────────
export const getUploadedAssetsFn = createServerFn({ method: "GET" }).handler(async () => {
  const { connectDB, UploadedAssetModel } = await import("./db.server");
  await connectDB();
  const list = await UploadedAssetModel.find().sort({ createdAt: -1 });
  return list.map(mapDoc);
});

export const registerUploadedAssetFn = createServerFn({ method: "POST" }).handler(
  async ({ data }: { data: any }) => {
    const { connectDB, UploadedAssetModel, AssetRequestModel } = await import("./db.server");
    await connectDB();

    const asset = new UploadedAssetModel(data);
    await asset.save();

    // If this upload was tied to a token request portal, flag the portal as Completed
    if (data.requestId) {
      await AssetRequestModel.findByIdAndUpdate(data.requestId, { status: "Completed" });
    }

    await logActivity(
      "Client Upload Completed",
      `Uploaded "${asset.originalFilename}" (${(asset.fileSize / (1024 * 1024)).toFixed(2)}MB) for ${asset.businessName}.`,
      asset.uploadedBy || "Client Portal"
    );

    return mapDoc(asset);
  }
);

export const deleteUploadedAssetFn = createServerFn({ method: "POST" }).handler(
  async ({ data }: { data: { id: string } }) => {
    const { connectDB, UploadedAssetModel } = await import("./db.server");
    await connectDB();

    // In serverless environment, we delete metadata from DB. 
    // Cloudinary storage files are retained, or optionally deleted using Cloudinary SDK in the future.
    await UploadedAssetModel.findByIdAndDelete(data.id);
    return { success: true };
  }
);

export const deleteFolderFn = createServerFn({ method: "POST" }).handler(
  async ({ data }: { data: { folderName: string } }) => {
    const { connectDB, UploadedAssetModel } = await import("./db.server");
    await connectDB();
    await UploadedAssetModel.deleteMany({ businessName: data.folderName });
    return { success: true };
  }
);

// ── Cloudinary Signed Upload Token ───────────────────────────────────────────
export const generateCloudinarySignatureFn = createServerFn({ method: "POST" }).handler(
  async ({ data }: { data: { timestamp: number } }) => {
    const CLOUDINARY_API_KEY = process.env.CLOUDINARY_API_KEY || "374544111595111";
    const CLOUDINARY_API_SECRET = process.env.CLOUDINARY_API_SECRET || "YrC-QFQV3MbkjsDMLtn-lFX_sGI";
    const CLOUDINARY_CLOUD_NAME = process.env.CLOUDINARY_CLOUD_NAME || "ddlfscxrm";

    if (!CLOUDINARY_API_SECRET) {
      throw new Error("Cloudinary credentials are not defined in server environment variables.");
    }

    const folder = "stellr_assets";

    // Sort parameters alphabetically to sign: folder, then timestamp
    const stringToSign = `folder=${folder}&timestamp=${data.timestamp}${CLOUDINARY_API_SECRET}`;

    const shasum = crypto.createHash("sha1");
    shasum.update(stringToSign);
    const signature = shasum.digest("hex");

    return {
      signature,
      apiKey: CLOUDINARY_API_KEY,
      cloudName: CLOUDINARY_CLOUD_NAME,
      folder
    };
  }
);

// ── Website Emails ──────────────────────────────────────────────────────────
export const getWebsiteEmailsFn = createServerFn({ method: "GET" }).handler(async () => {
  const { connectDB, WebsiteEmailModel } = await import("./db.server");
  await connectDB();
  const emails = await WebsiteEmailModel.find().sort({ createdAt: -1 });
  return emails.map(mapDoc);
});

export const submitWebsiteEmailFn = createServerFn({ method: "POST" }).handler(
  async ({ data }: { data: any }) => {
    const { connectDB, WebsiteEmailModel } = await import("./db.server");
    await connectDB();
    const emailDoc = new WebsiteEmailModel({
      ...data,
      submittedAt: new Date().toISOString(),
    });
    await emailDoc.save();

    await logActivity(
      "Inbound Form Inquiry",
      `Received ${emailDoc.type} request from ${emailDoc.name || emailDoc.email} (Service: ${emailDoc.service || "N/A"}).`,
      "Website Visitor"
    );

    if (emailDoc.type === "contact") {
      try {
        const { sendEmail, getContactFormNotificationHtml } = await import("./mail.server");
        const siteUrl = process.env.VITE_SITE_URL || "http://localhost:8083";
        const adminUrl = `${siteUrl}/dashboard/emails`;
        const submittedAt = new Date(emailDoc.submittedAt || Date.now()).toLocaleString("en-US", {
          dateStyle: "short",
          timeStyle: "short",
        });

        const htmlContent = getContactFormNotificationHtml({
          name: emailDoc.name || "N/A",
          email: emailDoc.email,
          phone: emailDoc.phone || "N/A",
          company: emailDoc.company || "N/A",
          service: emailDoc.service || "N/A",
          budget: emailDoc.budget || "N/A",
          message: emailDoc.message || "No message provided.",
          submittedAt,
          adminUrl,
        });

        await sendEmail({
          to: "jitenksony@gmail.com",
          subject: `StellR IT: New Contact Inquiry from ${emailDoc.name || emailDoc.email}`,
          text: `You have received a new contact inquiry on StellR IT from ${emailDoc.name || emailDoc.email}. Details: ${emailDoc.message || ""}`,
          html: htmlContent,
        });
      } catch (mailErr) {
        console.error("[Mail] Failed to send contact form inquiry email notification:", mailErr);
      }
    }

    // Emit socket event to notify admins
    try {
      const { io } = await import("socket.io-client");
      const RELAY_URL = process.env.VITE_RELAY_URL || "http://localhost:3001";
      const socket = io(RELAY_URL);
      socket.on("connect", () => {
        socket.emit("new-email", {
          email: {
            id: emailDoc._id.toString(),
            name: emailDoc.name || "",
            email: emailDoc.email,
            type: emailDoc.type,
            submittedAt: emailDoc.submittedAt,
            service: emailDoc.service || "",
            message: emailDoc.message || "",
          }
        });
        setTimeout(() => socket.disconnect(), 500);
      });
    } catch (err) {
      console.error("Failed to emit new-email socket event:", err);
    }

    return mapDoc(emailDoc);
  }
);

export const deleteWebsiteEmailFn = createServerFn({ method: "POST" }).handler(
  async ({ data }: { data: { id: string } }) => {
    const { connectDB, WebsiteEmailModel } = await import("./db.server");
    await connectDB();
    const email = await WebsiteEmailModel.findByIdAndDelete(data.id);

    if (email) {
      await logActivity(
        "Lead Inbound Removed",
        `Website inquiry lead from "${email.email}" was deleted.`,
        "System Admin"
      );
    }

    return { success: true };
  }
);

// ── Activity Logs ──────────────────────────────────────────────────────────
export const getActivityLogsFn = createServerFn({ method: "GET" }).handler(async () => {
  const { connectDB, ActivityLogModel } = await import("./db.server");
  await connectDB();

  let logs = await ActivityLogModel.find().sort({ createdAt: -1 }).limit(100);
  if (logs.length === 0) {
    const mockLogs = [
      { action: "Security Gate Audited", details: "Core CPU compute pools checked. Node Link stable.", performedBy: "System Admin", createdAt: new Date(Date.now() - 5 * 60 * 1000) },
      { action: "Workspace Authorized", details: "Jiten Sony logged into administrative portal.", performedBy: "Jiten Sony", createdAt: new Date(Date.now() - 15 * 60 * 1000) },
      { action: "Member Registered", details: "Sarah Jenkins was provisioned Supervisor access.", performedBy: "Jiten Sony", createdAt: new Date(Date.now() - 60 * 60 * 1000) },
      { action: "Theme Override Toggle", details: "Visual dark preference successfully synchronized.", performedBy: "System Admin", createdAt: new Date(Date.now() - 2 * 3600 * 1000) }
    ];
    await ActivityLogModel.insertMany(mockLogs);
    logs = await ActivityLogModel.find().sort({ createdAt: -1 });
  }
  return logs.map(mapDoc);
});

// ── Update Operator Credentials ──────────────────────────────────────────────
export const updateOperatorCredentialsFn = createServerFn({ method: "POST" }).handler(
  async ({ data }: { data: { id: string; name: string; username: string; password?: string; role: string; performedBy: string } }) => {
    const { connectDB, OperatorModel } = await import("./db.server");
    await connectDB();

    const updateData: any = {
      name: data.name,
      username: data.username.toLowerCase().trim(),
      role: data.role
    };
    if (data.password && data.password.trim()) {
      updateData.password = data.password.trim();
    }

    const updated = await OperatorModel.findByIdAndUpdate(data.id, updateData, { new: true });

    await logActivity(
      "Credentials Updated",
      `Operator profile for ${data.name} was modified (${data.role}).`,
      data.performedBy
    );

    return mapDoc(updated);
  }
);

// ── Database Details ────────────────────────────────────────────────────────
export const getDatabaseDetailsFn = createServerFn({ method: "GET" }).handler(async () => {
  const {
    connectDB,
    OperatorModel,
    TaskModel,
    ProjectModel,
    WebsiteEmailModel,
    ActivityLogModel
  } = await import("./db.server");
  const mongoose = (await import("mongoose")).default;
  await connectDB();

  const readyState = mongoose.connection.readyState;
  let connectionHost = "Unknown";
  let databaseName = "stellrit";

  if (mongoose.connection.host) {
    connectionHost = mongoose.connection.host;
  }
  if (mongoose.connection.name) {
    databaseName = mongoose.connection.name;
  }

  const operatorsCount = await OperatorModel.countDocuments();
  const tasksCount = await TaskModel.countDocuments();
  const projectsCount = await ProjectModel.countDocuments();
  const emailsCount = await WebsiteEmailModel.countDocuments();
  const logsCount = await ActivityLogModel.countDocuments();

  return {
    readyState,
    host: connectionHost,
    port: mongoose.connection.port || "27017",
    databaseName,
    counts: {
      operators: operatorsCount,
      tasks: tasksCount,
      projects: projectsCount,
      emails: emailsCount,
      logs: logsCount
    }
  };
});

// ── Dashboard Dynamic Stats & Historical Charts ──────────────────────────────
export const getDashboardStatsFn = createServerFn({ method: "GET" }).handler(async () => {
  const {
    connectDB,
    ProjectModel,
    WebsiteEmailModel,
    ChatSessionModel,
    ActivityLogModel
  } = await import("./db.server");
  await connectDB();

  // Fetch all metrics data
  const projects = await ProjectModel.find().lean();
  const websiteEmails = await WebsiteEmailModel.find().lean();

  // Recent Activities
  const recentLogs = await ActivityLogModel.find()
    .sort({ createdAt: -1 })
    .limit(10)
    .lean();

  const now = new Date();
  const currentMonth = now.getMonth(); // 0-11
  const currentYear = now.getFullYear();

  // Previous month details
  const prevMonth = currentMonth === 0 ? 11 : currentMonth - 1;
  const prevYear = currentMonth === 0 ? currentYear - 1 : currentYear;

  const isInMonth = (dateVal: any, month: number, year: number) => {
    if (!dateVal) return false;
    const d = new Date(dateVal);
    if (isNaN(d.getTime())) return false;
    return d.getMonth() === month && d.getFullYear() === year;
  };

  const isUpToMonth = (dateVal: any, month: number, year: number) => {
    if (!dateVal) return false;
    const d = new Date(dateVal);
    if (isNaN(d.getTime())) return false;
    const projectTime = new Date(d.getFullYear(), d.getMonth(), 1).getTime();
    const limitTime = new Date(year, month, 1).getTime();
    return projectTime <= limitTime;
  };

  // Metrics computation variables
  let curCollection = 0;
  let prevCollection = 0;
  let curSales = 0;
  let prevSales = 0;

  projects.forEach((proj: any) => {
    let projDate = proj.createdAt;
    if (proj.salesDate) {
      const d = new Date(proj.salesDate);
      if (!isNaN(d.getTime())) projDate = d;
    }

    const collected =
      Number(proj.accountSetup || 0) +
      Number(proj.firstInstallment || 0) +
      Number(proj.secondInstallment || 0) +
      Number(proj.thirdInstallment || 0);

    const cost = Number(proj.projectCost || 0);

    if (isInMonth(projDate, currentMonth, currentYear)) {
      curCollection += collected;
      curSales += cost;
    } else if (isInMonth(projDate, prevMonth, prevYear)) {
      prevCollection += collected;
      prevSales += cost;
    }
  });

  // Active website computation
  let curWebsites = 0;
  let prevWebsites = 0;

  projects.forEach((proj: any) => {
    if (proj.domainName && proj.domainName.trim() !== "") {
      let projDate = proj.createdAt;
      if (proj.salesDate) {
        const d = new Date(proj.salesDate);
        if (!isNaN(d.getTime())) projDate = d;
      }

      if (isUpToMonth(projDate, currentMonth, currentYear)) {
        curWebsites++;
      }
      if (isUpToMonth(projDate, prevMonth, prevYear)) {
        prevWebsites++;
      }
    }
  });

  // Conversion calculations
  let curProjectsCount = 0;
  let prevProjectsCount = 0;
  let curEmailsCount = 0;
  let prevEmailsCount = 0;
  let curChatsCount = 0;
  let prevChatsCount = 0;

  projects.forEach((proj: any) => {
    let projDate = proj.createdAt;
    if (proj.salesDate) {
      const d = new Date(proj.salesDate);
      if (!isNaN(d.getTime())) projDate = d;
    }
    if (isInMonth(projDate, currentMonth, currentYear)) {
      curProjectsCount++;
    } else if (isInMonth(projDate, prevMonth, prevYear)) {
      prevProjectsCount++;
    }
  });

  websiteEmails.forEach((email: any) => {
    const emailDate = email.createdAt || email.submittedAt;
    if (isInMonth(emailDate, currentMonth, currentYear)) {
      curEmailsCount++;
    } else if (isInMonth(emailDate, prevMonth, prevYear)) {
      prevEmailsCount++;
    }
  });

  const chatSessions = await ChatSessionModel.find().lean();
  chatSessions.forEach((chat: any) => {
    const chatDate = chat.createdAt;
    if (isInMonth(chatDate, currentMonth, currentYear)) {
      curChatsCount++;
    } else if (isInMonth(chatDate, prevMonth, prevYear)) {
      prevChatsCount++;
    }
  });

  // Calculate cumulative all-time metrics dynamically to avoid erratic month-to-month swings when data is low
  const totalProjects = projects.length;
  const totalEmails = websiteEmails.length;
  const totalChats = chatSessions.length;

  // Total leads = total signed projects + other unconverted inbound inquiries (emails, chats)
  const totalLeads = totalProjects + totalEmails + totalChats;
  const overallConversion = totalLeads > 0 ? (totalProjects / totalLeads) * 100 : 0;

  // Previous month's cumulative metrics for growth calculation
  const prevProjects = totalProjects - curProjectsCount;
  const prevEmails = totalEmails - curEmailsCount;
  const prevChats = totalChats - curChatsCount;
  const prevTotalLeads = prevProjects + prevEmails + prevChats;
  const prevConversion = prevTotalLeads > 0 ? (prevProjects / prevTotalLeads) * 100 : 0;

  const getGrowth = (current: number, previous: number) => {
    if (previous === 0) return current > 0 ? "+100%" : "0%";
    const pct = ((current - previous) / previous) * 100;
    const prefix = pct >= 0 ? "+" : "";
    return `${prefix}${pct.toFixed(1)}%`;
  };

  const collectionGrowth = getGrowth(curCollection, prevCollection);
  const salesGrowth = getGrowth(curSales, prevSales);
  const websitesGrowth = getGrowth(curWebsites, prevWebsites);
  const conversionGrowthDiff = overallConversion - prevConversion;
  const conversionGrowth = `${conversionGrowthDiff >= 0 ? "+" : ""}${conversionGrowthDiff.toFixed(1)}%`;

  // Historical 6 month collection & sales aggregation for the AreaChart
  const chartData = [];
  for (let i = 5; i >= 0; i--) {
    const d = new Date();
    d.setMonth(d.getMonth() - i);
    const m = d.getMonth();
    const y = d.getFullYear();
    const monthName = d.toLocaleString("default", { month: "short" });

    let monthCollection = 0;
    let monthSales = 0;

    projects.forEach((proj: any) => {
      let projDate = proj.createdAt;
      if (proj.salesDate) {
        const pd = new Date(proj.salesDate);
        if (!isNaN(pd.getTime())) projDate = pd;
      }

      if (isInMonth(projDate, m, y)) {
        const collected =
          Number(proj.accountSetup || 0) +
          Number(proj.firstInstallment || 0) +
          Number(proj.secondInstallment || 0) +
          Number(proj.thirdInstallment || 0);
        monthCollection += collected;
        monthSales += Number(proj.projectCost || 0);
      }
    });

    chartData.push({
      day: monthName,
      traffic: monthCollection, // Mapped to traffic key
      conversions: monthSales // Mapped to conversions key
    });
  }

  // Format activities timeline
  const mappedLogs = recentLogs.map((log: any) => {
    const logTime = new Date(log.createdAt || log.timestamp || Date.now());
    const diffMs = Date.now() - logTime.getTime();
    const diffMins = Math.floor(diffMs / 60000);
    const diffHours = Math.floor(diffMins / 60);
    const diffDays = Math.floor(diffHours / 24);

    let timeStr = "Just now";
    if (diffDays > 0) timeStr = `${diffDays}d ago`;
    else if (diffHours > 0) timeStr = `${diffHours}h ago`;
    else if (diffMins > 0) timeStr = `${diffMins}m ago`;

    return {
      id: log._id ? log._id.toString() : log.id,
      time: timeStr,
      action: log.action,
      details: log.details || "",
      performedBy: log.performedBy || "System"
    };
  });

  return {
    metrics: {
      collection: {
        value: `$${curCollection.toLocaleString()}`,
        growth: collectionGrowth
      },
      sales: {
        value: `${curProjectsCount} Project${curProjectsCount !== 1 ? 's' : ''}`,
        growth: salesGrowth
      },
      websites: {
        value: `${curWebsites}`,
        growth: websitesGrowth
      },
      conversion: {
        value: `${overallConversion.toFixed(1)}%`,
        growth: conversionGrowth
      }
    },
    chartData,
    activities: mappedLogs
  };
});
