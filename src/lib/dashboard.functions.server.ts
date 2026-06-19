import { createServerFn } from "@tanstack/react-start";
import crypto from "node:crypto";

// Helper to map mongoose documents to simple JS objects with string IDs
function mapDoc(d: any) {
  if (!d) return null;
  const obj = d.toObject ? d.toObject() : d;
  return {
    ...obj,
    id: obj._id ? obj._id.toString() : obj.id,
    _id: undefined,
    __v: undefined,
  };
}

// ── Diagnostics ──────────────────────────────────────────────────────────────
export const getDiagnosticsFn = createServerFn({ method: "GET" }).handler(async () => {
  const { connectDB, UploadedAssetModel } = await import("./db.server");
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

  return {
    cpuUsage: parseFloat((10 + Math.random() * 15).toFixed(1)), // mock active pool load
    heapUsed: memory.heapUsed,
    heapTotal: memory.heapTotal,
    uptime: Math.round(process.uptime()),
    databaseStatus: dbStatus,
    totalAssets: assetsCount,
    totalSize: totalSize
  };
});

// ── Operators ────────────────────────────────────────────────────────────────
export const getOperatorsFn = createServerFn({ method: "GET" }).handler(async () => {
  const { connectDB, OperatorModel } = await import("./db.server");
  await connectDB();

  let ops = await OperatorModel.find().sort({ createdAt: 1 });
  if (ops.length === 0) {
    const defaults = [
      { name: "Jiten Sony", email: "jiten@stellrit.com", role: "Super Admin", status: "Active", joinedDate: "2026-01-15", username: "stellr", password: "stellr123" },
      { name: "David Chen", email: "david.c@technova.com", role: "Developer", status: "Active", joinedDate: "2026-03-10", username: "david", password: "david123" },
      { name: "Sarah Jenkins", email: "sarah.j@nexus.io", role: "Analyst", status: "Active", joinedDate: "2026-04-02", username: "sarah", password: "sarah123" },
      { name: "Alex Rivera", email: "alex@riveradesign.co", role: "Developer", status: "Inactive", joinedDate: "2026-05-28", username: "alex", password: "alex123" }
    ];
    await OperatorModel.insertMany(defaults);
    ops = await OperatorModel.find().sort({ createdAt: 1 });
  }
  return ops.map(mapDoc);
});

export const createOperatorFn = createServerFn({ method: "POST" }).handler(
  async ({ data }: { data: any }) => {
    const { connectDB, OperatorModel } = await import("./db.server");
    await connectDB();
    const op = new OperatorModel(data);
    await op.save();
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
    return mapDoc(updated);
  }
);

export const deleteOperatorFn = createServerFn({ method: "POST" }).handler(
  async ({ data }: { data: { id: string } }) => {
    const { connectDB, OperatorModel } = await import("./db.server");
    await connectDB();
    await OperatorModel.findByIdAndDelete(data.id);
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
      dynamicCaseStudies: false
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
  const { connectDB, ProjectModel } = await import("./db.server");
  await connectDB();
  const list = await ProjectModel.find().sort({ createdAt: -1 });
  return list.map(mapDoc);
});

export const createProjectFn = createServerFn({ method: "POST" }).handler(
  async ({ data }: { data: any }) => {
    const { connectDB, ProjectModel } = await import("./db.server");
    await connectDB();
    const proj = new ProjectModel(data);
    await proj.save();
    return mapDoc(proj);
  }
);

export const updateProjectFn = createServerFn({ method: "POST" }).handler(
  async ({ data }: { data: { id: string; update: any } }) => {
    const { connectDB, ProjectModel } = await import("./db.server");
    await connectDB();
    const updated = await ProjectModel.findByIdAndUpdate(data.id, data.update, { new: true });
    return mapDoc(updated);
  }
);

export const deleteProjectFn = createServerFn({ method: "POST" }).handler(
  async ({ data }: { data: { id: string } }) => {
    const { connectDB, ProjectModel } = await import("./db.server");
    await connectDB();
    await ProjectModel.findByIdAndDelete(data.id);
    return { success: true };
  }
);

// ── Tasks CRUD ───────────────────────────────────────────────────────────────
export const getTasksFn = createServerFn({ method: "GET" }).handler(async () => {
  const { connectDB, TaskModel } = await import("./db.server");
  await connectDB();
  const list = await TaskModel.find().sort({ orderIndex: 1, createdAt: -1 });
  return list.map(mapDoc);
});

export const createTaskFn = createServerFn({ method: "POST" }).handler(
  async ({ data }: { data: any }) => {
    const { connectDB, TaskModel } = await import("./db.server");
    await connectDB();
    const task = new TaskModel(data);
    await task.save();
    return mapDoc(task);
  }
);

export const updateTaskFn = createServerFn({ method: "POST" }).handler(
  async ({ data }: { data: { id: string; update: any } }) => {
    const { connectDB, TaskModel } = await import("./db.server");
    await connectDB();
    const updated = await TaskModel.findByIdAndUpdate(data.id, data.update, { new: true });
    return mapDoc(updated);
  }
);

export const deleteTaskFn = createServerFn({ method: "POST" }).handler(
  async ({ data }: { data: { id: string } }) => {
    const { connectDB, TaskModel } = await import("./db.server");
    await connectDB();
    await TaskModel.findByIdAndDelete(data.id);
    return { success: true };
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
