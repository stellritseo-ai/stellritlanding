import http from 'node:http';
import fs from 'node:fs';
import path from 'node:path';
import dotenv from 'dotenv';
import mongoose from 'mongoose';
import multer from 'multer';
import * as archiverModule from 'archiver';
const archiver = ((archiverModule as any).default || archiverModule) as any;
import { v2 as cloudinary } from 'cloudinary';
import { ChatSession } from './models/ChatSession.js';
import { ChatMessage } from './models/ChatMessage.js';
import { Project } from './models/Project.js';
import { Task } from './models/Task.js';
import { SitePage } from './models/SitePage.js';
import { SiteConfig } from './models/SiteConfig.js';
import { AssetRequest } from './models/AssetRequest.js';
import { UploadedAsset } from './models/UploadedAsset.js';
import { Operator } from './models/Operator.js';

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

// ─── MongoDB Offline Fallback System ─────────────────────────────────────────
let isMongoOffline = false;

const PROJECTS_FILE = path.join(process.cwd(), 'projects-db.json');
const CHATS_FILE = path.join(process.cwd(), 'chat-db.json');
const TASKS_FILE = path.join(process.cwd(), 'tasks-db.json');
const SITE_PAGES_FILE = path.join(process.cwd(), 'site-pages-db.json');
const SITE_CONFIG_FILE = path.join(process.cwd(), 'site-config-db.json');
const ASSET_REQUESTS_FILE = path.join(process.cwd(), 'asset-requests-db.json');
const UPLOADED_ASSETS_FILE = path.join(process.cwd(), 'uploaded-assets-db.json');
const OPERATORS_FILE = path.join(process.cwd(), 'operators-db.json');
const UPLOADS_DIR = path.join(process.cwd(), 'public', 'uploads');

function readFallbackSitePages(): any[] {
  try {
    if (fs.existsSync(SITE_PAGES_FILE)) {
      return JSON.parse(fs.readFileSync(SITE_PAGES_FILE, 'utf-8'));
    }
  } catch (e) {
    console.error('Error reading fallback site pages JSON:', e);
  }
  return [];
}

function writeFallbackSitePages(data: any[]) {
  try {
    fs.writeFileSync(SITE_PAGES_FILE, JSON.stringify(data, null, 2));
  } catch (e) {
    console.error('Error writing fallback site pages JSON:', e);
  }
}

function readFallbackSiteConfig(): any {
  try {
    if (fs.existsSync(SITE_CONFIG_FILE)) {
      return JSON.parse(fs.readFileSync(SITE_CONFIG_FILE, 'utf-8'));
    }
  } catch (e) {
    console.error('Error reading fallback site config JSON:', e);
  }
  return {
    productionUrl: 'stellrit.com',
    avgSeoRank: '#4 Sector Avg',
    keywordsTracked: 42,
    coreWebVitals: 96,
    maintenanceMode: false
  };
}

function writeFallbackSiteConfig(data: any) {
  try {
    fs.writeFileSync(SITE_CONFIG_FILE, JSON.stringify(data, null, 2));
  } catch (e) {
    console.error('Error writing fallback site config JSON:', e);
  }
}

function readFallbackTasks(): any[] {
  try {
    if (fs.existsSync(TASKS_FILE)) {
      return JSON.parse(fs.readFileSync(TASKS_FILE, 'utf-8'));
    }
  } catch (e) {
    console.error('Error reading fallback tasks JSON:', e);
  }
  return [];
}

function writeFallbackTasks(data: any[]) {
  try {
    fs.writeFileSync(TASKS_FILE, JSON.stringify(data, null, 2));
  } catch (e) {
    console.error('Error writing fallback tasks JSON:', e);
  }
}

function generateLocalId(): string {
  const chars = 'abcdef0123456789';
  let result = '';
  for (let i = 0; i < 24; i++) {
    result += chars[Math.floor(Math.random() * chars.length)];
  }
  return result;
}

function readFallbackProjects(): any[] {
  try {
    if (fs.existsSync(PROJECTS_FILE)) {
      return JSON.parse(fs.readFileSync(PROJECTS_FILE, 'utf-8'));
    }
  } catch (e) {
    console.error('Error reading fallback projects JSON:', e);
  }
  return [];
}

function writeFallbackProjects(data: any[]) {
  try {
    fs.writeFileSync(PROJECTS_FILE, JSON.stringify(data, null, 2));
  } catch (e) {
    console.error('Error writing fallback projects JSON:', e);
  }
}

function readFallbackChats(): { sessions: any[]; messages: any[] } {
  try {
    if (fs.existsSync(CHATS_FILE)) {
      return JSON.parse(fs.readFileSync(CHATS_FILE, 'utf-8'));
    }
  } catch (e) {
    console.error('Error reading fallback chats JSON:', e);
  }
  return { sessions: [], messages: [] };
}

function writeFallbackChats(data: { sessions: any[]; messages: any[] }) {
  try {
    fs.writeFileSync(CHATS_FILE, JSON.stringify(data, null, 2));
  } catch (e) {
    console.error('Error writing fallback chats JSON:', e);
  }
}

// CAPTCHA in-memory storage
const activeCaptchas = new Map<string, { answer: number; expires: number }>();

// Simple cleanup interval for captcha tokens
setInterval(() => {
  const now = Date.now();
  for (const [token, data] of activeCaptchas.entries()) {
    if (data.expires < now) {
      activeCaptchas.delete(token);
    }
  }
}, 60000);

// Cloudinary Configuration
const isCloudinaryConfigured = !!(
  process.env.CLOUDINARY_CLOUD_NAME &&
  process.env.CLOUDINARY_API_KEY &&
  process.env.CLOUDINARY_API_SECRET
);

if (isCloudinaryConfigured) {
  console.log('☁️  Cloudinary is successfully configured and active.');
  cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET,
  });
} else {
  console.log('⚠️  Cloudinary is not fully configured in your .env. Running in local fallback mode.');
}

// Multer Storage Configuration
if (!fs.existsSync(path.join(process.cwd(), 'public'))) {
  fs.mkdirSync(path.join(process.cwd(), 'public'), { recursive: true });
}
if (!fs.existsSync(UPLOADS_DIR)) {
  fs.mkdirSync(UPLOADS_DIR, { recursive: true });
}

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, UPLOADS_DIR);
  },
  filename: function (req, file, cb) {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    cb(null, uniqueSuffix + '-' + file.originalname);
  }
});
const uploadMiddleware = multer({ storage: storage }).any();

function runMiddleware(req: any, res: any, fn: any) {
  return new Promise((resolve, reject) => {
    fn(req, res, (result: any) => {
      if (result instanceof Error) {
        return reject(result);
      }
      return resolve(result);
    });
  });
}

async function uploadFileToStorage(file: any): Promise<{ url: string; publicId?: string }> {
  if (isCloudinaryConfigured) {
    try {
      const result = await cloudinary.uploader.upload(file.path, {
        resource_type: 'auto',
        folder: 'stellr_assets',
      });
      try {
        fs.unlinkSync(file.path);
      } catch (unlinkErr) {
        console.error('Failed to delete temp file:', unlinkErr);
      }
      return {
        url: result.secure_url,
        publicId: result.public_id,
      };
    } catch (cloudinaryErr) {
      console.warn('Cloudinary upload failed, falling back to local storage:', cloudinaryErr);
    }
  }

  const filename = path.basename(file.path);
  const localUrl = `${process.env.VITE_CHAT_API_URL ?? 'http://localhost:3001'}/public/uploads/${filename}`;
  return {
    url: localUrl,
    publicId: undefined,
  };
}

function readFallbackAssetRequests(): any[] {
  try {
    if (fs.existsSync(ASSET_REQUESTS_FILE)) {
      return JSON.parse(fs.readFileSync(ASSET_REQUESTS_FILE, 'utf-8'));
    }
  } catch (e) {
    console.error('Error reading fallback asset requests:', e);
  }
  return [];
}

function writeFallbackAssetRequests(data: any[]) {
  try {
    fs.writeFileSync(ASSET_REQUESTS_FILE, JSON.stringify(data, null, 2));
  } catch (e) {
    console.error('Error writing fallback asset requests:', e);
  }
}

function readFallbackUploadedAssets(): any[] {
  try {
    if (fs.existsSync(UPLOADED_ASSETS_FILE)) {
      return JSON.parse(fs.readFileSync(UPLOADED_ASSETS_FILE, 'utf-8'));
    }
  } catch (e) {
    console.error('Error reading fallback uploaded assets:', e);
  }
  return [];
}

function writeFallbackUploadedAssets(data: any[]) {
  try {
    fs.writeFileSync(UPLOADED_ASSETS_FILE, JSON.stringify(data, null, 2));
  } catch (e) {
    console.error('Error writing fallback uploaded assets:', e);
  }
}

function readFallbackOperators(): any[] {
  try {
    if (fs.existsSync(OPERATORS_FILE)) {
      return JSON.parse(fs.readFileSync(OPERATORS_FILE, 'utf-8'));
    }
  } catch (e) {
    console.error('Error reading fallback operators:', e);
  }
  return [];
}

function writeFallbackOperators(data: any[]) {
  try {
    fs.writeFileSync(OPERATORS_FILE, JSON.stringify(data, null, 2));
  } catch (e) {
    console.error('Error writing fallback operators:', e);
  }
}

// AssetRequest Database Wrappers
async function dbGetAssetRequests(): Promise<any[]> {
  if (isMongoOffline) {
    return readFallbackAssetRequests();
  }
  return await AssetRequest.find({}).sort({ createdAt: -1 });
}

async function dbGetAssetRequestByToken(token: string): Promise<any> {
  if (isMongoOffline) {
    const list = readFallbackAssetRequests();
    return list.find(r => r.token === token) || null;
  }
  return await AssetRequest.findOne({ token });
}

async function dbCreateAssetRequest(data: any): Promise<any> {
  if (isMongoOffline) {
    const list = readFallbackAssetRequests();
    const newReq = {
      ...data,
      _id: generateLocalId(),
      createdAt: new Date(),
      updatedAt: new Date()
    };
    list.unshift(newReq);
    writeFallbackAssetRequests(list);
    return newReq;
  }
  return await AssetRequest.create(data);
}

async function dbUpdateAssetRequest(token: string, updateData: any): Promise<any> {
  if (isMongoOffline) {
    const list = readFallbackAssetRequests();
    const idx = list.findIndex(r => r.token === token);
    if (idx === -1) return null;
    const updated = {
      ...list[idx],
      ...updateData,
      updatedAt: new Date()
    };
    list[idx] = updated;
    writeFallbackAssetRequests(list);
    return updated;
  }
  return await AssetRequest.findOneAndUpdate({ token }, updateData, { new: true });
}

async function dbDeleteAssetRequest(id: string): Promise<any> {
  if (isMongoOffline) {
    const list = readFallbackAssetRequests();
    const idx = list.findIndex(r => r._id === id || r.id === id);
    if (idx === -1) return null;
    const deleted = list[idx];
    const filtered = list.filter(r => r._id !== id && r.id !== id);
    writeFallbackAssetRequests(filtered);
    return deleted;
  }
  return await AssetRequest.findByIdAndDelete(id);
}

// UploadedAsset Database Wrappers
async function dbGetUploadedAssets(): Promise<any[]> {
  if (isMongoOffline) {
    return readFallbackUploadedAssets();
  }
  return await UploadedAsset.find({}).sort({ createdAt: -1 });
}

async function dbCreateUploadedAsset(data: any): Promise<any> {
  if (isMongoOffline) {
    const list = readFallbackUploadedAssets();
    const newAsset = {
      ...data,
      _id: generateLocalId(),
      createdAt: new Date(),
      updatedAt: new Date()
    };
    list.unshift(newAsset);
    writeFallbackUploadedAssets(list);
    return newAsset;
  }
  return await UploadedAsset.create(data);
}

async function dbDeleteUploadedAsset(id: string): Promise<any> {
  if (isMongoOffline) {
    const list = readFallbackUploadedAssets();
    const idx = list.findIndex(a => a._id === id || a.id === id);
    if (idx === -1) return null;
    const deleted = list[idx];
    const filtered = list.filter(a => a._id !== id && a.id !== id);
    writeFallbackUploadedAssets(filtered);
    return deleted;
  }
  return await UploadedAsset.findByIdAndDelete(id);
}

async function dbDeleteAssetsByBusiness(businessName: string): Promise<any[]> {
  if (isMongoOffline) {
    const list = readFallbackUploadedAssets();
    const deleted = list.filter(a => a.businessName === businessName);
    const remaining = list.filter(a => a.businessName !== businessName);
    writeFallbackUploadedAssets(remaining);
    return deleted;
  }
  const deleted = await UploadedAsset.find({ businessName });
  await UploadedAsset.deleteMany({ businessName });
  return deleted;
}

// Ensure database files exist
if (!fs.existsSync(PROJECTS_FILE)) {
  writeFallbackProjects([]);
}
if (!fs.existsSync(CHATS_FILE)) {
  writeFallbackChats({ sessions: [], messages: [] });
}
if (!fs.existsSync(ASSET_REQUESTS_FILE)) {
  writeFallbackAssetRequests([]);
}
if (!fs.existsSync(UPLOADED_ASSETS_FILE)) {
  writeFallbackUploadedAssets([]);
}
if (!fs.existsSync(SITE_PAGES_FILE)) {
  writeFallbackSitePages([
    { _id: 'sp1', path: '/', title: 'Homepage — StellR IT', status: 'Published', speedScore: 98, createdAt: new Date(), updatedAt: new Date() },
    { _id: 'sp2', path: '/about', title: 'About Us — StellR IT', status: 'Published', speedScore: 96, createdAt: new Date(), updatedAt: new Date() },
    { _id: 'sp3', path: '/services', title: 'Services — StellR IT', status: 'Published', speedScore: 94, createdAt: new Date(), updatedAt: new Date() },
    { _id: 'sp4', path: '/contact', title: 'Contact — StellR IT', status: 'Published', speedScore: 97, createdAt: new Date(), updatedAt: new Date() },
    { _id: 'sp5', path: '/insights', title: 'Insights — StellR IT', status: 'Draft', speedScore: 0, createdAt: new Date(), updatedAt: new Date() }
  ]);
}
if (!fs.existsSync(SITE_CONFIG_FILE)) {
  writeFallbackSiteConfig({
    _id: 'sc1',
    productionUrl: 'stellrit.com',
    avgSeoRank: '#4 Sector Avg',
    keywordsTracked: 42,
    coreWebVitals: 96,
    maintenanceMode: false,
    aiHelpdeskAutoplay: true,
    edgeCacheCompression: true,
    dynamicCaseStudies: false,
    createdAt: new Date(),
    updatedAt: new Date()
  });
}
if (!fs.existsSync(OPERATORS_FILE)) {
  writeFallbackOperators([
    { _id: 'u1', name: 'Jiten Sony', email: 'jiten@stellrit.com', role: 'Super Admin', status: 'Active', joinedDate: '2026-01-15', username: 'stellr', password: 'stellr123', createdAt: new Date(), updatedAt: new Date() },
    { _id: 'u2', name: 'David Chen', email: 'david.c@technova.com', role: 'Developer', status: 'Active', joinedDate: '2026-03-10', username: 'david', password: 'david123', createdAt: new Date(), updatedAt: new Date() },
    { _id: 'u3', name: 'Sarah Jenkins', email: 'sarah.j@nexus.io', role: 'Analyst', status: 'Active', joinedDate: '2026-04-02', username: 'sarah', password: 'sarah123', createdAt: new Date(), updatedAt: new Date() },
    { _id: 'u4', name: 'Alex Rivera', email: 'alex@riveradesign.co', role: 'Developer', status: 'Inactive', joinedDate: '2026-05-28', username: 'alex', password: 'alex123', createdAt: new Date(), updatedAt: new Date() }
  ]);
}

function toIso(d: any): string {
  if (!d) return new Date().toISOString();
  if (d instanceof Date) return d.toISOString();
  try {
    return new Date(d).toISOString();
  } catch (e) {
    return new Date().toISOString();
  }
}

// Document wrapper helper to support Mongoose-like .save()
function makeOfflineDocument(doc: any, saveCallback: (doc: any) => Promise<void>) {
  if (!doc) return doc;
  return {
    ...doc,
    save: async function() {
      await saveCallback(this);
    }
  };
}

const saveSessionCallback = async (s: any) => {
  const chats = readFallbackChats();
  const idx = chats.sessions.findIndex(item => item._id === s._id);
  if (idx !== -1) {
    chats.sessions[idx] = {
      ...s,
      updatedAt: new Date()
    };
    writeFallbackChats(chats);
  }
};

// Project Database Wrappers
async function dbFindProjects(): Promise<any[]> {
  if (isMongoOffline) {
    return readFallbackProjects();
  }
  return await Project.find({}).sort({ createdAt: -1 });
}

async function dbCreateProject(data: any): Promise<any> {
  if (isMongoOffline) {
    const list = readFallbackProjects();
    const newProj = {
      ...data,
      _id: generateLocalId(),
      createdAt: new Date(),
      updatedAt: new Date()
    };
    list.unshift(newProj);
    writeFallbackProjects(list);
    return newProj;
  }
  return await Project.create(data);
}

async function dbCreateProjectsMany(data: any[]): Promise<any[]> {
  if (isMongoOffline) {
    const list = readFallbackProjects();
    const created = data.map(p => ({
      ...p,
      _id: generateLocalId(),
      createdAt: new Date(),
      updatedAt: new Date()
    }));
    writeFallbackProjects([...created, ...list]);
    return created;
  }
  const result = await Project.create(data);
  return Array.isArray(result) ? result : [result];
}

async function dbUpdateProject(id: string, updateData: any): Promise<any> {
  if (isMongoOffline) {
    const list = readFallbackProjects();
    const idx = list.findIndex(p => p._id === id);
    if (idx === -1) return null;
    const updated = {
      ...list[idx],
      ...updateData,
      updatedAt: new Date()
    };
    list[idx] = updated;
    writeFallbackProjects(list);
    return updated;
  }
  return await Project.findByIdAndUpdate(id, updateData, { new: true });
}

async function dbDeleteProject(id: string): Promise<any> {
  if (isMongoOffline) {
    const list = readFallbackProjects();
    const idx = list.findIndex(p => p._id === id);
    if (idx === -1) return null;
    const deleted = list[idx];
    const filtered = list.filter(p => p._id !== id);
    writeFallbackProjects(filtered);
    return deleted;
  }
  return await Project.findByIdAndDelete(id);
}

// Task Database Wrappers
async function dbGetTasks(): Promise<any[]> {
  if (isMongoOffline) {
    return readFallbackTasks();
  }
  return await Task.find({}).sort({ orderIndex: 1, createdAt: -1 });
}

async function dbCreateTask(data: any): Promise<any> {
  if (isMongoOffline) {
    const list = readFallbackTasks();
    const newTask = {
      ...data,
      _id: generateLocalId(),
      createdAt: new Date(),
      updatedAt: new Date()
    };
    list.push(newTask);
    writeFallbackTasks(list);
    return newTask;
  }
  return await Task.create(data);
}

async function dbUpdateTask(id: string, updateData: any): Promise<any> {
  if (isMongoOffline) {
    const list = readFallbackTasks();
    const idx = list.findIndex((t: any) => t._id === id || t.id === id);
    if (idx === -1) return null;
    const updated = {
      ...list[idx],
      ...updateData,
      updatedAt: new Date()
    };
    list[idx] = updated;
    writeFallbackTasks(list);
    return updated;
  }
  return await Task.findByIdAndUpdate(id, updateData, { new: true });
}

async function dbDeleteTask(id: string): Promise<any> {
  if (isMongoOffline) {
    const list = readFallbackTasks();
    const idx = list.findIndex((t: any) => t._id === id || t.id === id);
    if (idx === -1) return false;
    list.splice(idx, 1);
    writeFallbackTasks(list);
    return true;
  }
  return await Task.findByIdAndDelete(id);
}

// SitePage Database Wrappers
async function dbGetSitePages(): Promise<any[]> {
  if (isMongoOffline) {
    return readFallbackSitePages();
  }
  return await SitePage.find({}).sort({ createdAt: 1 });
}

async function dbCreateSitePage(data: any): Promise<any> {
  if (isMongoOffline) {
    const list = readFallbackSitePages();
    const newPage = {
      ...data,
      _id: generateLocalId(),
      createdAt: new Date(),
      updatedAt: new Date()
    };
    list.push(newPage);
    writeFallbackSitePages(list);
    return newPage;
  }
  return await SitePage.create(data);
}

async function dbUpdateSitePage(id: string, updateData: any): Promise<any> {
  if (isMongoOffline) {
    const list = readFallbackSitePages();
    const idx = list.findIndex(p => p._id === id || p.id === id);
    if (idx === -1) return null;
    const updated = {
      ...list[idx],
      ...updateData,
      updatedAt: new Date()
    };
    list[idx] = updated;
    writeFallbackSitePages(list);
    return updated;
  }
  return await SitePage.findByIdAndUpdate(id, updateData, { new: true });
}

async function dbDeleteSitePage(id: string): Promise<any> {
  if (isMongoOffline) {
    const list = readFallbackSitePages();
    const idx = list.findIndex(p => p._id === id || p.id === id);
    if (idx === -1) return null;
    const deleted = list[idx];
    const filtered = list.filter(p => p._id !== id && p.id !== id);
    writeFallbackSitePages(filtered);
    return deleted;
  }
  return await SitePage.findByIdAndDelete(id);
}

// Operator Database Wrappers
async function dbGetOperators(): Promise<any[]> {
  if (isMongoOffline) {
    return readFallbackOperators();
  }
  let ops = await Operator.find({}).sort({ createdAt: 1 });
  if (ops.length === 0) {
    const defaults = [
      { name: 'Jiten Sony', email: 'jiten@stellrit.com', role: 'Super Admin', status: 'Active', joinedDate: '2026-01-15', username: 'stellr', password: 'stellr123' },
      { name: 'David Chen', email: 'david.c@technova.com', role: 'Developer', status: 'Active', joinedDate: '2026-03-10', username: 'david', password: 'david123' },
      { name: 'Sarah Jenkins', email: 'sarah.j@nexus.io', role: 'Analyst', status: 'Active', joinedDate: '2026-04-02', username: 'sarah', password: 'sarah123' },
      { name: 'Alex Rivera', email: 'alex@riveradesign.co', role: 'Developer', status: 'Inactive', joinedDate: '2026-05-28', username: 'alex', password: 'alex123' }
    ];
    await Operator.insertMany(defaults);
    ops = await Operator.find({}).sort({ createdAt: 1 });
  }
  return ops;
}

async function dbCreateOperator(data: any): Promise<any> {
  if (isMongoOffline) {
    const list = readFallbackOperators();
    const newOp = {
      ...data,
      _id: generateLocalId(),
      createdAt: new Date(),
      updatedAt: new Date()
    };
    list.push(newOp);
    writeFallbackOperators(list);
    return newOp;
  }
  return await Operator.create(data);
}

async function dbUpdateOperator(id: string, updateData: any): Promise<any> {
  if (isMongoOffline) {
    const list = readFallbackOperators();
    const idx = list.findIndex(op => op._id === id || op.id === id);
    if (idx === -1) return null;
    const updated = {
      ...list[idx],
      ...updateData,
      updatedAt: new Date()
    };
    list[idx] = updated;
    writeFallbackOperators(list);
    return updated;
  }
  return await Operator.findByIdAndUpdate(id, updateData, { new: true });
}

async function dbDeleteOperator(id: string): Promise<any> {
  if (isMongoOffline) {
    const list = readFallbackOperators();
    const idx = list.findIndex(op => op._id === id || op.id === id);
    if (idx === -1) return null;
    const deleted = list[idx];
    const filtered = list.filter(op => op._id !== id && op.id !== id);
    writeFallbackOperators(filtered);
    return deleted;
  }
  return await Operator.findByIdAndDelete(id);
}

// SiteConfig Database Wrappers
async function dbGetSiteConfig(): Promise<any> {
  if (isMongoOffline) {
    const config = readFallbackSiteConfig();
    return config;
  }
  let config = await SiteConfig.findOne({});
  if (!config) {
    config = await SiteConfig.create({
      productionUrl: 'stellrit.com',
      avgSeoRank: '#4 Sector Avg',
      keywordsTracked: 42,
      coreWebVitals: 96
    });
  }
  return config;
}

async function dbUpdateSiteConfig(updateData: any): Promise<any> {
  if (isMongoOffline) {
    const config = readFallbackSiteConfig();
    const updated = {
      ...config,
      ...updateData,
      updatedAt: new Date()
    };
    writeFallbackSiteConfig(updated);
    return updated;
  }
  let config = await SiteConfig.findOne({});
  if (!config) {
    return await SiteConfig.create(updateData);
  }
  return await SiteConfig.findOneAndUpdate({}, updateData, { new: true });
}

// ChatSession Database Wrappers
async function dbFindOneSession(query: { visitorId: string; status: string }): Promise<any> {
  if (isMongoOffline) {
    const chats = readFallbackChats();
    const session = chats.sessions.find(s => s.visitorId === query.visitorId && s.status === query.status) || null;
    return makeOfflineDocument(session, saveSessionCallback);
  }
  return await ChatSession.findOne(query);
}

async function dbCreateSession(data: any): Promise<any> {
  if (isMongoOffline) {
    const chats = readFallbackChats();
    const newSession = {
      ...data,
      _id: generateLocalId(),
      createdAt: new Date(),
      updatedAt: new Date()
    };
    chats.sessions.unshift(newSession);
    writeFallbackChats(chats);
    return makeOfflineDocument(newSession, saveSessionCallback);
  }
  return await ChatSession.create(data);
}

async function dbFindSessionById(id: string): Promise<any> {
  if (isMongoOffline) {
    const chats = readFallbackChats();
    const session = chats.sessions.find(s => s._id === id) || null;
    return makeOfflineDocument(session, saveSessionCallback);
  }
  return await ChatSession.findById(id);
}

async function dbFindSessions(filter: any): Promise<any[]> {
  if (isMongoOffline) {
    const chats = readFallbackChats();
    let results = chats.sessions;
    if (filter.status) {
      results = results.filter(s => s.status === filter.status);
    }
    if (filter.$or) {
      results = results.filter(s => {
        return filter.$or.some((condition: any) => {
          if (condition.visitorName) {
            const term = condition.visitorName.source || condition.visitorName;
            return new RegExp(term, 'i').test(s.visitorName);
          }
          if (condition.visitorPhoneOrEmail) {
            const term = condition.visitorPhoneOrEmail.source || condition.visitorPhoneOrEmail;
            return new RegExp(term, 'i').test(s.visitorPhoneOrEmail);
          }
          return false;
        });
      });
    }
    const list = results.sort((a, b) => new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime());
    return list.map(s => makeOfflineDocument(s, saveSessionCallback));
  }
  return await ChatSession.find(filter).sort({ updatedAt: -1 });
}

async function dbUpdateSession(id: string, updateData: any): Promise<any> {
  if (isMongoOffline) {
    const chats = readFallbackChats();
    const idx = chats.sessions.findIndex(s => s._id === id);
    if (idx === -1) return null;
    const updated = {
      ...chats.sessions[idx],
      ...updateData,
      updatedAt: new Date()
    };
    chats.sessions[idx] = updated;
    writeFallbackChats(chats);
    return makeOfflineDocument(updated, saveSessionCallback);
  }
  return await ChatSession.findByIdAndUpdate(id, updateData, { new: true });
}

// ChatMessage Database Wrappers
async function dbFindMessages(query: { sessionId: any }): Promise<any[]> {
  const sessionIdStr = query.sessionId ? query.sessionId.toString() : '';
  if (isMongoOffline) {
    const chats = readFallbackChats();
    return chats.messages
      .filter(m => m.sessionId === sessionIdStr)
      .sort((a, b) => new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime());
  }
  return await ChatMessage.find({ sessionId: query.sessionId }).sort({ createdAt: 1 });
}

async function dbCreateMessage(data: any): Promise<any> {
  if (isMongoOffline) {
    const chats = readFallbackChats();
    const newMsg = {
      ...data,
      _id: generateLocalId(),
      sessionId: data.sessionId ? data.sessionId.toString() : '',
      createdAt: new Date(),
      readAt: null
    };
    chats.messages.push(newMsg);
    writeFallbackChats(chats);
    return newMsg;
  }
  return await ChatMessage.create(data);
}

async function dbCountMessages(query: { sessionId: any; senderType: string; readAt: null }): Promise<number> {
  const sessionIdStr = query.sessionId ? query.sessionId.toString() : '';
  if (isMongoOffline) {
    const chats = readFallbackChats();
    return chats.messages.filter(
      m => m.sessionId === sessionIdStr && m.senderType === query.senderType && m.readAt === null
    ).length;
  }
  return await ChatMessage.countDocuments(query);
}

async function dbFindLastMessage(sessionId: any): Promise<any> {
  const sessionIdStr = sessionId ? sessionId.toString() : '';
  if (isMongoOffline) {
    const chats = readFallbackChats();
    const msgs = chats.messages.filter(m => m.sessionId === sessionIdStr);
    if (msgs.length === 0) return null;
    return msgs.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())[0];
  }
  return await ChatMessage.findOne({ sessionId }).sort({ createdAt: -1 });
}

async function dbUpdateManyMessages(query: any, update: any): Promise<void> {
  const sessionIdStr = query.sessionId ? query.sessionId.toString() : '';
  if (isMongoOffline) {
    const chats = readFallbackChats();
    chats.messages = chats.messages.map(m => {
      if (m.sessionId === sessionIdStr && m.senderType === query.senderType && m.readAt === null) {
        return {
          ...m,
          readAt: update.readAt || new Date()
        };
      }
      return m;
    });
    writeFallbackChats(chats);
    return;
  }
  await ChatMessage.updateMany(
    {
      sessionId: new mongoose.Types.ObjectId(query.sessionId),
      senderType: query.senderType,
      readAt: query.readAt,
    },
    update
  );
}

// Connect to MongoDB
try {
  const resolvedUri = await getStandardMongoUri(MONGO_URI);
  await mongoose.connect(resolvedUri);
  console.log('🔌 Connected to MongoDB successfully via Mongoose.');
  
  // Migrate existing operators without credentials
  try {
    await Operator.updateMany(
      { email: 'jiten@stellrit.com', username: { $exists: false } },
      { $set: { username: 'stellr', password: 'stellr123' } }
    );
    await Operator.updateMany(
      { email: 'david.c@technova.com', username: { $exists: false } },
      { $set: { username: 'david', password: 'david123' } }
    );
    await Operator.updateMany(
      { email: 'sarah.j@nexus.io', username: { $exists: false } },
      { $set: { username: 'sarah', password: 'sarah123' } }
    );
    await Operator.updateMany(
      { email: 'alex@riveradesign.co', username: { $exists: false } },
      { $set: { username: 'alex', password: 'alex123' } }
    );
  } catch (migErr) {
    console.warn('Operator credentials migration failed:', migErr);
  }
} catch (err: any) {
  console.warn('⚠️ MongoDB connection error, switching to Local JSON fallback:', err.message);
  isMongoOffline = true;
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
  const origin = req.headers.origin;
  if (origin) {
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

  // Static file serving for uploads fallback
  if (pathname.startsWith('/public/uploads/')) {
    let filename = pathname.replace('/public/uploads/', '');
    try {
      filename = decodeURIComponent(filename);
    } catch (e) {
      console.error('Failed to decode filename:', e);
    }
    const safeFilename = path.basename(filename);
    const filePath = path.join(UPLOADS_DIR, safeFilename);

    if (fs.existsSync(filePath)) {
      const ext = path.extname(filePath).toLowerCase();
      let contentType = 'application/octet-stream';
      if (ext === '.jpg' || ext === '.jpeg') contentType = 'image/jpeg';
      else if (ext === '.png') contentType = 'image/png';
      else if (ext === '.gif') contentType = 'image/gif';
      else if (ext === '.webp') contentType = 'image/webp';
      else if (ext === '.svg') contentType = 'image/svg+xml';
      else if (ext === '.pdf') contentType = 'application/pdf';
      else if (ext === '.mp4') contentType = 'video/mp4';
      else if (ext === '.webm') contentType = 'video/webm';
      else if (ext === '.doc') contentType = 'application/msword';
      else if (ext === '.docx') contentType = 'application/vnd.openxmlformats-officedocument.wordprocessingml.document';
      else if (ext === '.xls') contentType = 'application/vnd.ms-excel';
      else if (ext === '.xlsx') contentType = 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet';
      else if (ext === '.zip') contentType = 'application/zip';
      else if (ext === '.txt') contentType = 'text/plain';

      res.writeHead(200, { 'Content-Type': contentType });
      fs.createReadStream(filePath).pipe(res);
      return;
    } else {
      res.statusCode = 404;
      res.setHeader('Content-Type', 'application/json');
      res.end(JSON.stringify({ error: 'File not found' }));
      return;
    }
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

      let session = await dbFindOneSession({ visitorId, status: 'open' });

      if (!session) {
        session = await dbCreateSession({
          visitorId,
          visitorName,
          visitorPhoneOrEmail,
          status: 'open',
        });

        broadcast({
          type: 'session-created',
          data: {
            id: (session._id || session.id).toString(),
            visitorId: session.visitorId,
            visitorName: session.visitorName,
            visitorPhoneOrEmail: session.visitorPhoneOrEmail,
            status: session.status,
            createdAt: toIso(session.createdAt),
            updatedAt: toIso(session.updatedAt),
          }
        });
      }

      res.writeHead(201, { 'Content-Type': 'application/json' });
      res.end(
        JSON.stringify({
          id: (session._id || session.id).toString(),
          visitorId: session.visitorId,
          visitorName: session.visitorName,
          visitorPhoneOrEmail: session.visitorPhoneOrEmail,
          status: session.status,
          createdAt: toIso(session.createdAt),
          updatedAt: toIso(session.updatedAt),
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

      const session = await dbFindSessionById(sessionId);

      if (!session) {
        res.statusCode = 404;
        res.setHeader('Content-Type', 'application/json');
        res.end(JSON.stringify({ error: 'Session not found' }));
        return;
      }

      res.writeHead(200, { 'Content-Type': 'application/json' });
      res.end(
        JSON.stringify({
          id: (session._id || session.id).toString(),
          visitorId: session.visitorId,
          visitorName: session.visitorName,
          visitorPhoneOrEmail: session.visitorPhoneOrEmail,
          status: session.status,
          createdAt: toIso(session.createdAt),
          updatedAt: toIso(session.updatedAt),
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

      const session = await dbFindSessionById(sessionId);

      if (!session) {
        res.statusCode = 404;
        res.setHeader('Content-Type', 'application/json');
        res.end(JSON.stringify({ error: 'Session not found' }));
        return;
      }

      const messages = await dbFindMessages({ sessionId: session._id || session.id });
      res.writeHead(200, { 'Content-Type': 'application/json' });
      res.end(
        JSON.stringify(
          messages.map((m) => ({
            id: (m._id || m.id).toString(),
            sessionId: m.sessionId ? m.sessionId.toString() : '',
            senderType: m.senderType,
            message: m.message,
            createdAt: toIso(m.createdAt),
            readAt: m.readAt ? toIso(m.readAt) : null,
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

      const session = await dbFindSessionById(sessionId);

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

      const savedMsg = await dbCreateMessage({
        sessionId: session._id || session.id,
        senderType: 'visitor',
        message: messageText,
      });

      session.updatedAt = new Date();
      await session.save();

      const msgPayload = {
        id: (savedMsg._id || savedMsg.id).toString(),
        sessionId: savedMsg.sessionId ? savedMsg.sessionId.toString() : '',
        senderType: savedMsg.senderType,
        message: savedMsg.message,
        createdAt: toIso(savedMsg.createdAt),
        readAt: null,
      };

      broadcast({ type: 'new-message', data: msgPayload }, sessionId);

      res.writeHead(201, { 'Content-Type': 'application/json' });
      res.end(JSON.stringify(msgPayload));
      return;
    }

    // GET /api/admin/projects
    if (req.method === 'GET' && pathname === '/api/admin/projects') {
      if (!isAuthorizedAdmin(req, urlObj)) {
        res.statusCode = 401;
        res.setHeader('Content-Type', 'application/json');
        res.end(JSON.stringify({ error: 'Unauthorized' }));
        return;
      }

      let projectsList = await dbFindProjects();

      // Auto-seeding default projects if collection is empty
      if (projectsList.length === 0) {
        console.log('🌱 Database collection for Project is empty. Seeding defaults...');
        const defaults = [
          {
            clientName: "Elite Medical",
            projectName: "Elite Patient Portal",
            businessName: "Elite Medical Clinic",
            salesDate: "2026-05-10",
            ownerName: "Alex Rivera",
            domainName: "elitemedicalportal.com",
            phoneNumber: "+1 (312) 555-0199",
            projectCost: 15000,
            accountSetup: 2000,
            firstInstallment: 3000,
            secondInstallment: 3000,
            thirdInstallment: 0,
            hostingFee: 500,
            closeBy: "2026-07-15",
            cardDetails: "Visa ending in 4242",
            projectDetails: "Patient appointment scheduling and medical records intake portal.",
            isCompleted: false,
            color: "from-purple-500 to-indigo-500",
          },
          {
            clientName: "Nexus Group",
            projectName: "Nexus SaaS Dashboard",
            businessName: "Nexus SaaS",
            salesDate: "2026-04-15",
            ownerName: "Sarah Jenkins",
            domainName: "nexusdashboard.app",
            phoneNumber: "+1 (512) 555-8833",
            projectCost: 25000,
            accountSetup: 5000,
            firstInstallment: 10000,
            secondInstallment: 10000,
            thirdInstallment: 0,
            hostingFee: 1200,
            closeBy: "2026-06-30",
            cardDetails: "Mastercard ending in 9876",
            projectDetails: "Enterprise SaaS analytics visualizer with real-time web socket integrations.",
            isCompleted: false,
            color: "from-pink-500 to-rose-500",
          },
          {
            clientName: "TechNova Corp",
            projectName: "TechNova Mobile App",
            businessName: "TechNova Apps",
            salesDate: "2026-05-20",
            ownerName: "David Chen",
            domainName: "technovamobile.io",
            phoneNumber: "+1 (408) 555-0144",
            projectCost: 18000,
            accountSetup: 3000,
            firstInstallment: 5000,
            secondInstallment: 5000,
            thirdInstallment: 5000,
            hostingFee: 800,
            closeBy: "2026-08-10",
            cardDetails: "Amex ending in 1001",
            projectDetails: "React Native scheduling and dispatch app for local mechanics and field agents.",
            isCompleted: true,
            color: "from-amber-500 to-orange-500",
          },
          {
            clientName: "Internal Product",
            projectName: "StellR Web Redesign",
            businessName: "StellR IT Services",
            salesDate: "2026-06-01",
            ownerName: "Alex Rivera",
            domainName: "stellrwebsite.dev",
            phoneNumber: "+1 (800) 555-3829",
            projectCost: 8000,
            accountSetup: 0,
            firstInstallment: 0,
            secondInstallment: 0,
            thirdInstallment: 0,
            hostingFee: 0,
            closeBy: "2026-09-01",
            cardDetails: "N/A",
            projectDetails: "Brand overhaul, SEO optimizations, and landing pages for StellR IT Services.",
            isCompleted: false,
            color: "from-emerald-500 to-teal-500",
          }
        ];
        projectsList = await dbCreateProjectsMany(defaults);
      }

      res.writeHead(200, { 'Content-Type': 'application/json' });
      res.end(
        JSON.stringify(
          projectsList.map((p) => ({
            id: p._id.toString(),
            clientName: p.clientName,
            projectName: p.projectName,
            businessName: p.businessName || '',
            salesDate: p.salesDate,
            ownerName: p.ownerName,
            domainName: p.domainName,
            phoneNumber: p.phoneNumber,
            projectCost: p.projectCost,
            accountSetup: p.accountSetup,
            firstInstallment: p.firstInstallment,
            secondInstallment: p.secondInstallment,
            thirdInstallment: p.thirdInstallment,
            hostingFee: p.hostingFee,
            closeBy: p.closeBy,
            cardDetails: p.cardDetails,
            projectDetails: p.projectDetails,
            isCompleted: p.isCompleted,
            color: p.color,
            createdAt: toIso(p.createdAt),
            updatedAt: toIso(p.updatedAt),
          }))
        )
      );
      return;
    }

    // POST /api/admin/projects
    if (req.method === 'POST' && pathname === '/api/admin/projects') {
      if (!isAuthorizedAdmin(req, urlObj)) {
        res.statusCode = 401;
        res.setHeader('Content-Type', 'application/json');
        res.end(JSON.stringify({ error: 'Unauthorized' }));
        return;
      }

      const body = await getRequestBody(req);
      const newProj = await dbCreateProject({
        clientName: sanitize(body.clientName || ''),
        projectName: sanitize(body.projectName || ''),
        businessName: sanitize(body.businessName || ''),
        salesDate: sanitize(body.salesDate || ''),
        ownerName: sanitize(body.ownerName || ''),
        domainName: sanitize(body.domainName || ''),
        phoneNumber: sanitize(body.phoneNumber || ''),
        projectCost: Number(body.projectCost || 0),
        accountSetup: Number(body.accountSetup || 0),
        firstInstallment: Number(body.firstInstallment || 0),
        secondInstallment: Number(body.secondInstallment || 0),
        thirdInstallment: Number(body.thirdInstallment || 0),
        hostingFee: Number(body.hostingFee || 0),
        closeBy: sanitize(body.closeBy || ''),
        cardDetails: sanitize(body.cardDetails || ''),
        projectDetails: sanitize(body.projectDetails || ''),
        isCompleted: Boolean(body.isCompleted || false),
        color: sanitize(body.color || 'from-purple-500 to-indigo-500'),
      });

      res.writeHead(201, { 'Content-Type': 'application/json' });
      res.end(
        JSON.stringify({
          id: newProj._id.toString(),
          clientName: newProj.clientName,
          projectName: newProj.projectName,
          businessName: newProj.businessName || '',
          salesDate: newProj.salesDate,
          ownerName: newProj.ownerName,
          domainName: newProj.domainName,
          phoneNumber: newProj.phoneNumber,
          projectCost: newProj.projectCost,
          accountSetup: newProj.accountSetup,
          firstInstallment: newProj.firstInstallment,
          secondInstallment: newProj.secondInstallment,
          thirdInstallment: newProj.thirdInstallment,
          hostingFee: newProj.hostingFee,
          closeBy: newProj.closeBy,
          cardDetails: newProj.cardDetails,
          projectDetails: newProj.projectDetails,
          isCompleted: newProj.isCompleted,
          color: newProj.color,
          createdAt: toIso(newProj.createdAt),
          updatedAt: toIso(newProj.updatedAt),
        })
      );
      return;
    }

    // PUT /api/admin/projects/:id
    const updateProjectMatch = pathname.match(/^\/api\/admin\/projects\/([^/]+)$/);
    if ((req.method === 'PUT' || req.method === 'PATCH') && updateProjectMatch) {
      if (!isAuthorizedAdmin(req, urlObj)) {
        res.statusCode = 401;
        res.setHeader('Content-Type', 'application/json');
        res.end(JSON.stringify({ error: 'Unauthorized' }));
        return;
      }

      const projectId = updateProjectMatch[1];
      if (!mongoose.Types.ObjectId.isValid(projectId) && !isMongoOffline) {
        res.statusCode = 404;
        res.setHeader('Content-Type', 'application/json');
        res.end(JSON.stringify({ error: 'Project not found' }));
        return;
      }

      const body = await getRequestBody(req);
      const updateData: any = {};
      
      if (body.clientName !== undefined) updateData.clientName = sanitize(body.clientName);
      if (body.projectName !== undefined) updateData.projectName = sanitize(body.projectName);
      if (body.businessName !== undefined) updateData.businessName = sanitize(body.businessName);
      if (body.salesDate !== undefined) updateData.salesDate = sanitize(body.salesDate);
      if (body.ownerName !== undefined) updateData.ownerName = sanitize(body.ownerName);
      if (body.domainName !== undefined) updateData.domainName = sanitize(body.domainName);
      if (body.phoneNumber !== undefined) updateData.phoneNumber = sanitize(body.phoneNumber);
      if (body.projectCost !== undefined) updateData.projectCost = Number(body.projectCost);
      if (body.accountSetup !== undefined) updateData.accountSetup = Number(body.accountSetup);
      if (body.firstInstallment !== undefined) updateData.firstInstallment = Number(body.firstInstallment);
      if (body.secondInstallment !== undefined) updateData.secondInstallment = Number(body.secondInstallment);
      if (body.thirdInstallment !== undefined) updateData.thirdInstallment = Number(body.thirdInstallment);
      if (body.hostingFee !== undefined) updateData.hostingFee = Number(body.hostingFee);
      if (body.closeBy !== undefined) updateData.closeBy = sanitize(body.closeBy);
      if (body.cardDetails !== undefined) updateData.cardDetails = sanitize(body.cardDetails);
      if (body.projectDetails !== undefined) updateData.projectDetails = sanitize(body.projectDetails);
      if (body.isCompleted !== undefined) updateData.isCompleted = Boolean(body.isCompleted);
      if (body.color !== undefined) updateData.color = sanitize(body.color);

      const updatedProj = await dbUpdateProject(projectId, updateData);

      if (!updatedProj) {
        res.statusCode = 404;
        res.setHeader('Content-Type', 'application/json');
        res.end(JSON.stringify({ error: 'Project not found' }));
        return;
      }

      res.writeHead(200, { 'Content-Type': 'application/json' });
      res.end(
        JSON.stringify({
          id: updatedProj._id.toString(),
          clientName: updatedProj.clientName,
          projectName: updatedProj.projectName,
          businessName: updatedProj.businessName || '',
          salesDate: updatedProj.salesDate,
          ownerName: updatedProj.ownerName,
          domainName: updatedProj.domainName,
          phoneNumber: updatedProj.phoneNumber,
          projectCost: updatedProj.projectCost,
          accountSetup: updatedProj.accountSetup,
          firstInstallment: updatedProj.firstInstallment,
          secondInstallment: updatedProj.secondInstallment,
          thirdInstallment: updatedProj.thirdInstallment,
          hostingFee: updatedProj.hostingFee,
          closeBy: updatedProj.closeBy,
          cardDetails: updatedProj.cardDetails,
          projectDetails: updatedProj.projectDetails,
          isCompleted: updatedProj.isCompleted,
          color: updatedProj.color,
          createdAt: toIso(updatedProj.createdAt),
          updatedAt: toIso(updatedProj.updatedAt),
        })
      );
      return;
    }

    // DELETE /api/admin/projects/:id
    const deleteProjectMatch = pathname.match(/^\/api\/admin\/projects\/([^/]+)$/);
    if (req.method === 'DELETE' && deleteProjectMatch) {
      if (!isAuthorizedAdmin(req, urlObj)) {
        res.statusCode = 401;
        res.setHeader('Content-Type', 'application/json');
        res.end(JSON.stringify({ error: 'Unauthorized' }));
        return;
      }

      const projectId = deleteProjectMatch[1];
      if (!mongoose.Types.ObjectId.isValid(projectId) && !isMongoOffline) {
        res.statusCode = 404;
        res.setHeader('Content-Type', 'application/json');
        res.end(JSON.stringify({ error: 'Project not found' }));
        return;
      }

      const deletedProj = await dbDeleteProject(projectId);

      if (!deletedProj) {
        res.statusCode = 404;
        res.setHeader('Content-Type', 'application/json');
        res.end(JSON.stringify({ error: 'Project not found' }));
        return;
      }

      res.writeHead(200, { 'Content-Type': 'application/json' });
      res.end(JSON.stringify({ success: true, id: projectId }));
      return;
    }

    // GET /api/admin/tasks
    if (req.method === 'GET' && pathname === '/api/admin/tasks') {
      if (!isAuthorizedAdmin(req, urlObj)) {
        res.statusCode = 401;
        res.setHeader('Content-Type', 'application/json');
        res.end(JSON.stringify({ error: 'Unauthorized' }));
        return;
      }
      
      const tasksList = await dbGetTasks();
      res.writeHead(200, { 'Content-Type': 'application/json' });
      res.end(
        JSON.stringify(
          tasksList.map((t) => ({
            id: t._id ? t._id.toString() : t.id,
            title: t.title,
            projectName: t.projectName || '',
            businessName: t.businessName || '',
            assignedUsers: t.assignedUsers || [],
            priority: t.priority || 'Medium',
            status: t.status || 'To Do',
            tags: t.tags || [],
            description: t.description || '',
            businessInfo: t.businessInfo || {},
            domainInfo: t.domainInfo || {},
            attachments: t.attachments || [],
            checklist: t.checklist || [],
            comments: t.comments || [],
            activityHistory: t.activityHistory || [],
            relatedProjectId: t.relatedProjectId || '',
            createdBy: t.createdBy || '',
            orderIndex: t.orderIndex || 0,
            createdAt: toIso(t.createdAt),
            updatedAt: toIso(t.updatedAt),
          }))
        )
      );
      return;
    }

    // POST /api/admin/tasks
    if (req.method === 'POST' && pathname === '/api/admin/tasks') {
      if (!isAuthorizedAdmin(req, urlObj)) {
        res.statusCode = 401;
        res.setHeader('Content-Type', 'application/json');
        res.end(JSON.stringify({ error: 'Unauthorized' }));
        return;
      }

      const body = await getRequestBody(req);
      const newTask = await dbCreateTask({
        title: sanitize(body.title || 'Untitled Task'),
        projectName: sanitize(body.projectName || ''),
        businessName: sanitize(body.businessName || ''),
        assignedUsers: body.assignedUsers || [],
        priority: body.priority || 'Medium',
        status: body.status || 'To Do',
        tags: body.tags || [],
        description: sanitize(body.description || ''),
        businessInfo: {
          businessName: sanitize(body.businessInfo?.businessName || ''),
          contactPerson: sanitize(body.businessInfo?.contactPerson || ''),
          phoneNumber: sanitize(body.businessInfo?.phoneNumber || ''),
          email: sanitize(body.businessInfo?.email || ''),
          website: sanitize(body.businessInfo?.website || ''),
          requirements: body.businessInfo?.requirements || []
        },
        domainInfo: {
          domainName: sanitize(body.domainInfo?.domainName || '')
        },
        attachments: body.attachments || [],
        checklist: body.checklist || [],
        comments: body.comments || [],
        activityHistory: body.activityHistory || [],
        relatedProjectId: sanitize(body.relatedProjectId || ''),
        createdBy: sanitize(body.createdBy || 'System'),
        orderIndex: Number(body.orderIndex || 0)
      });

      res.writeHead(201, { 'Content-Type': 'application/json' });
      res.end(
        JSON.stringify({
          id: newTask._id ? newTask._id.toString() : newTask.id,
          title: newTask.title,
          projectName: newTask.projectName,
          businessName: newTask.businessName,
          assignedUsers: newTask.assignedUsers,
          priority: newTask.priority,
          status: newTask.status,
          tags: newTask.tags,
          description: newTask.description,
          businessInfo: newTask.businessInfo,
          domainInfo: newTask.domainInfo,
          attachments: newTask.attachments,
          checklist: newTask.checklist,
          comments: newTask.comments,
          activityHistory: newTask.activityHistory,
          relatedProjectId: newTask.relatedProjectId,
          createdBy: newTask.createdBy,
          orderIndex: newTask.orderIndex,
          createdAt: toIso(newTask.createdAt),
          updatedAt: toIso(newTask.updatedAt),
        })
      );
      return;
    }

    // PUT /api/admin/tasks/:id
    const updateTaskMatch = pathname.match(/^\/api\/admin\/tasks\/([^/]+)$/);
    if ((req.method === 'PUT' || req.method === 'PATCH') && updateTaskMatch) {
      if (!isAuthorizedAdmin(req, urlObj)) {
        res.statusCode = 401;
        res.setHeader('Content-Type', 'application/json');
        res.end(JSON.stringify({ error: 'Unauthorized' }));
        return;
      }

      const taskId = updateTaskMatch[1];
      if (!mongoose.Types.ObjectId.isValid(taskId) && !isMongoOffline) {
        res.statusCode = 404;
        res.setHeader('Content-Type', 'application/json');
        res.end(JSON.stringify({ error: 'Task not found' }));
        return;
      }

      const body = await getRequestBody(req);
      const updateData: any = {};

      if (body.title !== undefined) updateData.title = sanitize(body.title);
      if (body.projectName !== undefined) updateData.projectName = sanitize(body.projectName);
      if (body.businessName !== undefined) updateData.businessName = sanitize(body.businessName);
      if (body.assignedUsers !== undefined) updateData.assignedUsers = body.assignedUsers;
      if (body.priority !== undefined) updateData.priority = body.priority;
      if (body.status !== undefined) updateData.status = body.status;
      if (body.tags !== undefined) updateData.tags = body.tags;
      if (body.description !== undefined) updateData.description = sanitize(body.description);
      if (body.businessInfo !== undefined) {
        updateData.businessInfo = {
          businessName: sanitize(body.businessInfo.businessName || ''),
          contactPerson: sanitize(body.businessInfo.contactPerson || ''),
          phoneNumber: sanitize(body.businessInfo.phoneNumber || ''),
          email: sanitize(body.businessInfo.email || ''),
          website: sanitize(body.businessInfo.website || ''),
          requirements: body.businessInfo.requirements || []
        };
      }
      if (body.domainInfo !== undefined) {
        updateData.domainInfo = {
          domainName: sanitize(body.domainInfo.domainName || '')
        };
      }
      if (body.attachments !== undefined) updateData.attachments = body.attachments;
      if (body.checklist !== undefined) updateData.checklist = body.checklist;
      if (body.comments !== undefined) updateData.comments = body.comments;
      if (body.activityHistory !== undefined) updateData.activityHistory = body.activityHistory;
      if (body.relatedProjectId !== undefined) updateData.relatedProjectId = sanitize(body.relatedProjectId);
      if (body.createdBy !== undefined) updateData.createdBy = sanitize(body.createdBy);
      if (body.orderIndex !== undefined) updateData.orderIndex = Number(body.orderIndex);

      const updatedTask = await dbUpdateTask(taskId, updateData);

      if (!updatedTask) {
        res.statusCode = 404;
        res.setHeader('Content-Type', 'application/json');
        res.end(JSON.stringify({ error: 'Task not found' }));
        return;
      }

      res.writeHead(200, { 'Content-Type': 'application/json' });
      res.end(
        JSON.stringify({
          id: updatedTask._id ? updatedTask._id.toString() : updatedTask.id,
          title: updatedTask.title,
          projectName: updatedTask.projectName,
          businessName: updatedTask.businessName,
          assignedUsers: updatedTask.assignedUsers,
          priority: updatedTask.priority,
          status: updatedTask.status,
          tags: updatedTask.tags,
          description: updatedTask.description,
          businessInfo: updatedTask.businessInfo,
          domainInfo: updatedTask.domainInfo,
          attachments: updatedTask.attachments,
          checklist: updatedTask.checklist,
          comments: updatedTask.comments,
          activityHistory: updatedTask.activityHistory,
          relatedProjectId: updatedTask.relatedProjectId,
          createdBy: updatedTask.createdBy,
          orderIndex: updatedTask.orderIndex,
          createdAt: toIso(updatedTask.createdAt),
          updatedAt: toIso(updatedTask.updatedAt),
        })
      );
      return;
    }

    // DELETE /api/admin/tasks/:id
    const deleteTaskMatch = pathname.match(/^\/api\/admin\/tasks\/([^/]+)$/);
    if (req.method === 'DELETE' && deleteTaskMatch) {
      if (!isAuthorizedAdmin(req, urlObj)) {
        res.statusCode = 401;
        res.setHeader('Content-Type', 'application/json');
        res.end(JSON.stringify({ error: 'Unauthorized' }));
        return;
      }

      const taskId = deleteTaskMatch[1];
      if (!mongoose.Types.ObjectId.isValid(taskId) && !isMongoOffline) {
        res.statusCode = 404;
        res.setHeader('Content-Type', 'application/json');
        res.end(JSON.stringify({ error: 'Task not found' }));
        return;
      }

      const success = await dbDeleteTask(taskId);

      if (!success) {
        res.statusCode = 404;
        res.setHeader('Content-Type', 'application/json');
        res.end(JSON.stringify({ error: 'Task not found' }));
        return;
      }

      res.writeHead(200, { 'Content-Type': 'application/json' });
      res.end(JSON.stringify({ success: true, id: taskId }));
      return;
    }

    // GET /api/admin/site-pages
    if (req.method === 'GET' && pathname === '/api/admin/site-pages') {
      if (!isAuthorizedAdmin(req, urlObj)) {
        res.statusCode = 401;
        res.setHeader('Content-Type', 'application/json');
        res.end(JSON.stringify({ error: 'Unauthorized' }));
        return;
      }
      const pagesList = await dbGetSitePages();
      res.writeHead(200, { 'Content-Type': 'application/json' });
      res.end(JSON.stringify(pagesList.map(p => ({
        id: p._id ? p._id.toString() : p.id,
        path: p.path,
        title: p.title,
        status: p.status,
        speedScore: p.speedScore,
        createdAt: toIso(p.createdAt),
        updatedAt: toIso(p.updatedAt)
      }))));
      return;
    }

    // POST /api/admin/site-pages
    if (req.method === 'POST' && pathname === '/api/admin/site-pages') {
      if (!isAuthorizedAdmin(req, urlObj)) {
        res.statusCode = 401;
        res.setHeader('Content-Type', 'application/json');
        res.end(JSON.stringify({ error: 'Unauthorized' }));
        return;
      }
      const body = await getRequestBody(req);
      const newPage = await dbCreateSitePage({
        path: sanitize(body.path || '/'),
        title: sanitize(body.title || 'Untitled Page'),
        status: body.status || 'Draft',
        speedScore: Number(body.speedScore || 0)
      });
      res.writeHead(201, { 'Content-Type': 'application/json' });
      res.end(JSON.stringify({
        id: newPage._id ? newPage._id.toString() : newPage.id,
        path: newPage.path,
        title: newPage.title,
        status: newPage.status,
        speedScore: newPage.speedScore,
        createdAt: toIso(newPage.createdAt),
        updatedAt: toIso(newPage.updatedAt)
      }));
      return;
    }

    // PUT /api/admin/site-pages/:id
    const updatePageMatch = pathname.match(/^\/api\/admin\/site-pages\/([^/]+)$/);
    if ((req.method === 'PUT' || req.method === 'PATCH') && updatePageMatch) {
      if (!isAuthorizedAdmin(req, urlObj)) {
        res.statusCode = 401;
        res.setHeader('Content-Type', 'application/json');
        res.end(JSON.stringify({ error: 'Unauthorized' }));
        return;
      }
      const pageId = updatePageMatch[1];
      const body = await getRequestBody(req);
      const updateData: any = {};
      if (body.path !== undefined) updateData.path = sanitize(body.path);
      if (body.title !== undefined) updateData.title = sanitize(body.title);
      if (body.status !== undefined) updateData.status = body.status;
      if (body.speedScore !== undefined) updateData.speedScore = Number(body.speedScore);

      const updated = await dbUpdateSitePage(pageId, updateData);
      if (!updated) {
        res.statusCode = 404;
        res.setHeader('Content-Type', 'application/json');
        res.end(JSON.stringify({ error: 'Page not found' }));
        return;
      }
      res.writeHead(200, { 'Content-Type': 'application/json' });
      res.end(JSON.stringify({
        id: updated._id ? updated._id.toString() : updated.id,
        path: updated.path,
        title: updated.title,
        status: updated.status,
        speedScore: updated.speedScore,
        createdAt: toIso(updated.createdAt),
        updatedAt: toIso(updated.updatedAt)
      }));
      return;
    }

    // DELETE /api/admin/site-pages/:id
    const deletePageMatch = pathname.match(/^\/api\/admin\/site-pages\/([^/]+)$/);
    if (req.method === 'DELETE' && deletePageMatch) {
      if (!isAuthorizedAdmin(req, urlObj)) {
        res.statusCode = 401;
        res.setHeader('Content-Type', 'application/json');
        res.end(JSON.stringify({ error: 'Unauthorized' }));
        return;
      }
      const pageId = deletePageMatch[1];
      const deleted = await dbDeleteSitePage(pageId);
      if (!deleted) {
        res.statusCode = 404;
        res.setHeader('Content-Type', 'application/json');
        res.end(JSON.stringify({ error: 'Page not found' }));
        return;
      }
      res.writeHead(200, { 'Content-Type': 'application/json' });
      res.end(JSON.stringify({ success: true, id: pageId }));
      return;
    }

    // POST /api/auth/login
    if (req.method === 'POST' && pathname === '/api/auth/login') {
      const body = await getRequestBody(req);
      const username = body.username ? sanitize(body.username) : '';
      const password = body.password ? sanitize(body.password) : '';

      if (!username || !password) {
        res.statusCode = 400;
        res.setHeader('Content-Type', 'application/json');
        res.end(JSON.stringify({ error: 'Username and password are required' }));
        return;
      }

      let op;
      if (isMongoOffline) {
        const list = readFallbackOperators();
        op = list.find(o => o.username === username);
      } else {
        op = await Operator.findOne({ username });
      }

      if (op && op.password === password) {
        if (op.status !== 'Active') {
          res.statusCode = 403;
          res.setHeader('Content-Type', 'application/json');
          res.end(JSON.stringify({ error: 'Operator account is inactive' }));
          return;
        }
        const adminToken = process.env.ADMIN_TOKEN || 'stellr-admin-dev-2024';
        res.writeHead(200, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify({
          success: true,
          token: adminToken,
          user: {
            name: op.name,
            email: op.email,
            role: op.role
          }
        }));
        return;
      }

      res.statusCode = 401;
      res.setHeader('Content-Type', 'application/json');
      res.end(JSON.stringify({ error: 'Invalid username or password' }));
      return;
    }

    // GET /api/public/site-config
    if (req.method === 'GET' && pathname === '/api/public/site-config') {
      const config = await dbGetSiteConfig();
      res.writeHead(200, { 'Content-Type': 'application/json' });
      res.end(JSON.stringify({
        productionUrl: config.productionUrl,
        avgSeoRank: config.avgSeoRank,
        keywordsTracked: config.keywordsTracked,
        coreWebVitals: config.coreWebVitals,
        maintenanceMode: config.maintenanceMode ?? false,
        aiHelpdeskAutoplay: config.aiHelpdeskAutoplay ?? true,
        edgeCacheCompression: config.edgeCacheCompression ?? true,
        dynamicCaseStudies: config.dynamicCaseStudies ?? false,
      }));
      return;
    }

    // GET /api/admin/site-config
    if (req.method === 'GET' && pathname === '/api/admin/site-config') {
      if (!isAuthorizedAdmin(req, urlObj)) {
        res.statusCode = 401;
        res.setHeader('Content-Type', 'application/json');
        res.end(JSON.stringify({ error: 'Unauthorized' }));
        return;
      }
      const config = await dbGetSiteConfig();
      res.writeHead(200, { 'Content-Type': 'application/json' });
      res.end(JSON.stringify({
        id: config._id ? config._id.toString() : config.id,
        productionUrl: config.productionUrl,
        avgSeoRank: config.avgSeoRank,
        keywordsTracked: config.keywordsTracked,
        coreWebVitals: config.coreWebVitals,
        maintenanceMode: config.maintenanceMode ?? false,
        aiHelpdeskAutoplay: config.aiHelpdeskAutoplay ?? true,
        edgeCacheCompression: config.edgeCacheCompression ?? true,
        dynamicCaseStudies: config.dynamicCaseStudies ?? false,
        createdAt: toIso(config.createdAt),
        updatedAt: toIso(config.updatedAt)
      }));
      return;
    }

    // PUT /api/admin/site-config
    if ((req.method === 'PUT' || req.method === 'PATCH') && pathname === '/api/admin/site-config') {
      if (!isAuthorizedAdmin(req, urlObj)) {
        res.statusCode = 401;
        res.setHeader('Content-Type', 'application/json');
        res.end(JSON.stringify({ error: 'Unauthorized' }));
        return;
      }
      const body = await getRequestBody(req);
      const updateData: any = {};
      if (body.productionUrl !== undefined) updateData.productionUrl = sanitize(body.productionUrl);
      if (body.avgSeoRank !== undefined) updateData.avgSeoRank = sanitize(body.avgSeoRank);
      if (body.keywordsTracked !== undefined) updateData.keywordsTracked = Number(body.keywordsTracked);
      if (body.coreWebVitals !== undefined) updateData.coreWebVitals = Number(body.coreWebVitals);
      if (body.maintenanceMode !== undefined) updateData.maintenanceMode = Boolean(body.maintenanceMode);
      if (body.aiHelpdeskAutoplay !== undefined) updateData.aiHelpdeskAutoplay = Boolean(body.aiHelpdeskAutoplay);
      if (body.edgeCacheCompression !== undefined) updateData.edgeCacheCompression = Boolean(body.edgeCacheCompression);
      if (body.dynamicCaseStudies !== undefined) updateData.dynamicCaseStudies = Boolean(body.dynamicCaseStudies);

      const updated = await dbUpdateSiteConfig(updateData);
      res.writeHead(200, { 'Content-Type': 'application/json' });
      res.end(JSON.stringify({
        id: updated._id ? updated._id.toString() : updated.id,
        productionUrl: updated.productionUrl,
        avgSeoRank: updated.avgSeoRank,
        keywordsTracked: updated.keywordsTracked,
        coreWebVitals: updated.coreWebVitals,
        maintenanceMode: updated.maintenanceMode ?? false,
        aiHelpdeskAutoplay: updated.aiHelpdeskAutoplay ?? true,
        edgeCacheCompression: updated.edgeCacheCompression ?? true,
        dynamicCaseStudies: updated.dynamicCaseStudies ?? false,
        createdAt: toIso(updated.createdAt),
        updatedAt: toIso(updated.updatedAt)
      }));
      return;
    }

    // GET /api/admin/operators
    if (req.method === 'GET' && pathname === '/api/admin/operators') {
      if (!isAuthorizedAdmin(req, urlObj)) {
        res.statusCode = 401;
        res.setHeader('Content-Type', 'application/json');
        res.end(JSON.stringify({ error: 'Unauthorized' }));
        return;
      }
      const operatorsList = await dbGetOperators();
      res.writeHead(200, { 'Content-Type': 'application/json' });
      res.end(JSON.stringify(operatorsList.map(op => ({
        id: op._id ? op._id.toString() : op.id,
        name: op.name,
        email: op.email,
        role: op.role,
        status: op.status,
        joinedDate: op.joinedDate,
        createdAt: toIso(op.createdAt),
        updatedAt: toIso(op.updatedAt)
      }))));
      return;
    }

    // POST /api/admin/operators
    if (req.method === 'POST' && pathname === '/api/admin/operators') {
      if (!isAuthorizedAdmin(req, urlObj)) {
        res.statusCode = 401;
        res.setHeader('Content-Type', 'application/json');
        res.end(JSON.stringify({ error: 'Unauthorized' }));
        return;
      }
      const body = await getRequestBody(req);
      if (!body.name || !body.email) {
        res.statusCode = 400;
        res.setHeader('Content-Type', 'application/json');
        res.end(JSON.stringify({ error: 'Name and Email are required' }));
        return;
      }
      const opData = {
        name: sanitize(body.name),
        email: sanitize(body.email),
        role: body.role || 'Developer',
        status: body.status || 'Active',
        joinedDate: body.joinedDate || new Date().toISOString().split('T')[0]
      };
      const createdOp = await dbCreateOperator(opData);
      res.writeHead(201, { 'Content-Type': 'application/json' });
      res.end(JSON.stringify({
        id: createdOp._id ? createdOp._id.toString() : createdOp.id,
        ...opData,
        createdAt: toIso(createdOp.createdAt),
        updatedAt: toIso(createdOp.updatedAt)
      }));
      return;
    }

    // PATCH /api/admin/operators/:id
    const patchOperatorMatch = pathname.match(/^\/api\/admin\/operators\/([^/]+)$/);
    if ((req.method === 'PATCH' || req.method === 'PUT') && patchOperatorMatch) {
      if (!isAuthorizedAdmin(req, urlObj)) {
        res.statusCode = 401;
        res.setHeader('Content-Type', 'application/json');
        res.end(JSON.stringify({ error: 'Unauthorized' }));
        return;
      }
      const id = patchOperatorMatch[1];
      const body = await getRequestBody(req);
      const updateData: any = {};
      if (body.name !== undefined) updateData.name = sanitize(body.name);
      if (body.email !== undefined) updateData.email = sanitize(body.email);
      if (body.role !== undefined) updateData.role = body.role;
      if (body.status !== undefined) updateData.status = body.status;

      const updatedOp = await dbUpdateOperator(id, updateData);
      if (!updatedOp) {
        res.statusCode = 404;
        res.setHeader('Content-Type', 'application/json');
        res.end(JSON.stringify({ error: 'Operator not found' }));
        return;
      }
      res.writeHead(200, { 'Content-Type': 'application/json' });
      res.end(JSON.stringify({
        id: updatedOp._id ? updatedOp._id.toString() : updatedOp.id,
        name: updatedOp.name,
        email: updatedOp.email,
        role: updatedOp.role,
        status: updatedOp.status,
        joinedDate: updatedOp.joinedDate,
        createdAt: toIso(updatedOp.createdAt),
        updatedAt: toIso(updatedOp.updatedAt)
      }));
      return;
    }

    // DELETE /api/admin/operators/:id
    const deleteOperatorMatch = pathname.match(/^\/api\/admin\/operators\/([^/]+)$/);
    if (req.method === 'DELETE' && deleteOperatorMatch) {
      if (!isAuthorizedAdmin(req, urlObj)) {
        res.statusCode = 401;
        res.setHeader('Content-Type', 'application/json');
        res.end(JSON.stringify({ error: 'Unauthorized' }));
        return;
      }
      const id = deleteOperatorMatch[1];
      const deletedOp = await dbDeleteOperator(id);
      if (!deletedOp) {
        res.statusCode = 404;
        res.setHeader('Content-Type', 'application/json');
        res.end(JSON.stringify({ error: 'Operator not found' }));
        return;
      }
      res.writeHead(200, { 'Content-Type': 'application/json' });
      res.end(JSON.stringify({ success: true, deleted: deletedOp }));
      return;
    }

    // GET /api/admin/diagnostics
    if (req.method === 'GET' && pathname === '/api/admin/diagnostics') {
      if (!isAuthorizedAdmin(req, urlObj)) {
        res.statusCode = 401;
        res.setHeader('Content-Type', 'application/json');
        res.end(JSON.stringify({ error: 'Unauthorized' }));
        return;
      }

      const mem = process.memoryUsage();
      const heapUsed = mem.heapUsed;
      const heapTotal = mem.heapTotal;

      let totalAssets = 0;
      let totalSize = 0;
      try {
        if (isMongoOffline) {
          const list = readFallbackUploadedAssets();
          totalAssets = list.length;
          totalSize = list.reduce((sum, a) => sum + (a.fileSize || 0), 0);
        } else {
          totalAssets = await UploadedAsset.countDocuments({});
          const agg = await UploadedAsset.aggregate([
            { $group: { _id: null, total: { $sum: '$fileSize' } } }
          ]);
          totalSize = agg[0]?.total || 0;
        }
      } catch (err) {
        console.error('Error fetching vault footprint:', err);
      }

      const baseCpu = 12 + Math.floor(Math.sin(Date.now() / 60000) * 8);
      const jitter = Math.floor(Math.random() * 4);
      const cpuUsage = baseCpu + jitter;

      res.writeHead(200, { 'Content-Type': 'application/json' });
      res.end(JSON.stringify({
        cpuUsage,
        heapUsed,
        heapTotal,
        uptime: Math.floor(process.uptime()),
        databaseStatus: isMongoOffline ? 'Offline Fallback (JSON)' : (mongoose.connection.readyState === 1 ? 'Connected' : 'Connecting/Disconnected'),
        totalAssets,
        totalSize
      }));
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

      const sessions = await dbFindSessions(filter);

      const withUnread = await Promise.all(
        sessions.map(async (s) => {
          const sId = s._id || s.id;
          const unreadCount = await dbCountMessages({
            sessionId: sId,
            senderType: 'visitor',
            readAt: null,
          });
          const lastMsg = await dbFindLastMessage(sId);
          return {
            id: sId ? sId.toString() : '',
            visitorId: s.visitorId,
            visitorName: s.visitorName,
            visitorPhoneOrEmail: s.visitorPhoneOrEmail,
            status: s.status,
            createdAt: toIso(s.createdAt),
            updatedAt: toIso(s.updatedAt),
            unreadCount,
            lastMessage: lastMsg?.message ?? '',
            lastMessageAt: lastMsg?.createdAt ? toIso(lastMsg.createdAt) : toIso(s.createdAt),
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

      if (!mongoose.Types.ObjectId.isValid(sessionId) && !isMongoOffline) {
        res.statusCode = 404;
        res.setHeader('Content-Type', 'application/json');
        res.end(JSON.stringify({ error: 'Session not found' }));
        return;
      }

      const session = await dbFindSessionById(sessionId);

      if (!session) {
        res.statusCode = 404;
        res.setHeader('Content-Type', 'application/json');
        res.end(JSON.stringify({ error: 'Session not found' }));
        return;
      }

      const sessionKeyId = session._id || session.id;
      const messages = await dbFindMessages({ sessionId: sessionKeyId });
      res.writeHead(200, { 'Content-Type': 'application/json' });
      res.end(
        JSON.stringify({
          session: {
            id: sessionKeyId ? sessionKeyId.toString() : '',
            visitorId: session.visitorId,
            visitorName: session.visitorName,
            visitorPhoneOrEmail: session.visitorPhoneOrEmail,
            status: session.status,
            createdAt: toIso(session.createdAt),
            updatedAt: toIso(session.updatedAt),
          },
          messages: messages.map((m) => ({
            id: (m._id || m.id).toString(),
            sessionId: m.sessionId ? m.sessionId.toString() : '',
            senderType: m.senderType,
            message: m.message,
            createdAt: toIso(m.createdAt),
            readAt: m.readAt ? toIso(m.readAt) : null,
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

      if (!mongoose.Types.ObjectId.isValid(sessionId) && !isMongoOffline) {
        res.statusCode = 404;
        res.setHeader('Content-Type', 'application/json');
        res.end(JSON.stringify({ error: 'Session not found' }));
        return;
      }

      const session = await dbFindSessionById(sessionId);

      if (!session) {
        res.statusCode = 404;
        res.setHeader('Content-Type', 'application/json');
        res.end(JSON.stringify({ error: 'Session not found' }));
        return;
      }

      const savedMsg = await dbCreateMessage({
        sessionId: session._id || session.id,
        senderType: 'admin',
        message: messageText,
      });

      session.updatedAt = new Date();
      await session.save();

      const msgPayload = {
        id: (savedMsg._id || savedMsg.id).toString(),
        sessionId: savedMsg.sessionId ? savedMsg.sessionId.toString() : '',
        senderType: savedMsg.senderType,
        message: savedMsg.message,
        createdAt: toIso(savedMsg.createdAt),
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

      if (!mongoose.Types.ObjectId.isValid(sessionId) && !isMongoOffline) {
        res.statusCode = 404;
        res.setHeader('Content-Type', 'application/json');
        res.end(JSON.stringify({ error: 'Session not found' }));
        return;
      }

      const session = await dbUpdateSession(sessionId, { status });

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

      if (!mongoose.Types.ObjectId.isValid(sessionId) && !isMongoOffline) {
        res.statusCode = 400;
        res.setHeader('Content-Type', 'application/json');
        res.end(JSON.stringify({ error: 'Invalid sessionId' }));
        return;
      }

      const oppositeSender = readBy === 'admin' ? 'visitor' : 'admin';

      await dbUpdateManyMessages(
        {
          sessionId,
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

    // GET /api/public/captcha
    if (req.method === 'GET' && pathname === '/api/public/captcha') {
      const num1 = Math.floor(Math.random() * 20) + 1;
      const num2 = Math.floor(Math.random() * 10) + 1;
      const captchaToken = Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15);
      activeCaptchas.set(captchaToken, { answer: num1 + num2, expires: Date.now() + 300000 });

      res.writeHead(200, { 'Content-Type': 'application/json' });
      res.end(JSON.stringify({
        captchaToken,
        question: `What is ${num1} + ${num2}?`
      }));
      return;
    }

    // GET /api/public/assets/requests/:token
    const getPublicRequestMatch = pathname.match(/^\/api\/public\/assets\/requests\/([^/]+)$/);
    if (req.method === 'GET' && getPublicRequestMatch) {
      const token = getPublicRequestMatch[1];
      const request = await dbGetAssetRequestByToken(token);

      if (!request) {
        res.statusCode = 404;
        res.setHeader('Content-Type', 'application/json');
        res.end(JSON.stringify({ error: 'Upload link not found or invalid.' }));
        return;
      }

      // Check Expiration
      if (request.expirationDate && new Date(request.expirationDate) < new Date()) {
        if (request.status !== 'Expired') {
          await dbUpdateAssetRequest(token, { status: 'Expired' });
        }
        res.writeHead(200, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify({ expired: true, status: 'Expired', businessName: request.businessName }));
        return;
      }

      res.writeHead(200, { 'Content-Type': 'application/json' });
      res.end(JSON.stringify({
        businessName: request.businessName,
        clientName: request.clientName || '',
        notes: request.notes || '',
        maxUploadSize: request.maxUploadSize,
        allowedFileTypes: request.allowedFileTypes,
        status: request.status,
        expirationDate: request.expirationDate || null,
        relatedProjectId: request.relatedProjectId || ''
      }));
      return;
    }

    // POST /api/public/assets/upload/:token
    const postPublicUploadMatch = pathname.match(/^\/api\/public\/assets\/upload\/([^/]+)$/);
    if (req.method === 'POST' && postPublicUploadMatch) {
      const token = postPublicUploadMatch[1];
      const request = await dbGetAssetRequestByToken(token);

      if (!request) {
        res.statusCode = 404;
        res.setHeader('Content-Type', 'application/json');
        res.end(JSON.stringify({ error: 'Request not found' }));
        return;
      }

      if (request.expirationDate && new Date(request.expirationDate) < new Date()) {
        res.statusCode = 400;
        res.setHeader('Content-Type', 'application/json');
        res.end(JSON.stringify({ error: 'This upload link has expired.' }));
        return;
      }

      // Parse multipart form
      try {
        await runMiddleware(req, res, uploadMiddleware);
      } catch (err: any) {
        res.statusCode = 500;
        res.setHeader('Content-Type', 'application/json');
        res.end(JSON.stringify({ error: 'Failed to process files.', message: err?.message }));
        return;
      }

      // Verify CAPTCHA
      const cReq = req as any;
      const cToken = cReq.body?.captchaToken;
      const captchaAnswer = parseInt(cReq.body?.captchaAnswer || '', 10);
      const capRecord = activeCaptchas.get(cToken);

      if (!capRecord || capRecord.expires < Date.now() || capRecord.answer !== captchaAnswer) {
        // Delete all temp files
        if (cReq.files && Array.isArray(cReq.files)) {
          for (const file of cReq.files) {
            try { fs.unlinkSync(file.path); } catch (e) {}
          }
        }
        res.statusCode = 400;
        res.setHeader('Content-Type', 'application/json');
        res.end(JSON.stringify({ error: 'Invalid or expired CAPTCHA answer.' }));
        return;
      }
      activeCaptchas.delete(cToken); // single-use

      const files = cReq.files as any[];
      if (!files || files.length === 0) {
        res.statusCode = 400;
        res.setHeader('Content-Type', 'application/json');
        res.end(JSON.stringify({ error: 'No files provided for upload.' }));
        return;
      }

      // Check max size and allowed formats
      const maxLimit = request.maxUploadSize || 104857600; // 100MB
      const allowedCategories = request.allowedFileTypes || ['images', 'videos', 'documents'];

      const clientName = cReq.body?.clientName || request.clientName || '';
      const clientEmail = cReq.body?.email || request.email || '';
      const clientPhone = cReq.body?.phone || request.phone || '';
      const clientNotes = cReq.body?.notes || '';

      const savedAssets: any[] = [];

      for (const file of files) {
        // Size validation
        if (file.size > maxLimit) {
          // Delete all remaining temp files
          for (const f of files) {
            try { fs.unlinkSync(f.path); } catch (e) {}
          }
          res.statusCode = 400;
          res.setHeader('Content-Type', 'application/json');
          res.end(JSON.stringify({ error: `File ${file.originalname} exceeds size limit of ${Math.round(maxLimit/1024/1024)}MB.` }));
          return;
        }

        // Allowed types validation
        const mime = file.mimetype || '';
        let detectedType: 'image' | 'video' | 'document' | null = null;
        if (mime.startsWith('image/')) detectedType = 'image';
        else if (mime.startsWith('video/')) detectedType = 'video';
        else detectedType = 'document';

        const categoryKeyMap: Record<'image' | 'video' | 'document', string> = {
          image: 'images',
          video: 'videos',
          document: 'documents'
        };

        const hasCategory = allowedCategories.includes(categoryKeyMap[detectedType]);
        if (!hasCategory) {
          // Delete all temp files
          for (const f of files) {
            try { fs.unlinkSync(f.path); } catch (e) {}
          }
          res.statusCode = 400;
          res.setHeader('Content-Type', 'application/json');
          res.end(JSON.stringify({ error: `File type of ${file.originalname} is not allowed.` }));
          return;
        }

        // Upload
        const uploadResult = await uploadFileToStorage(file);

        // Save UploadedAsset
        const asset = await dbCreateUploadedAsset({
          requestId: (request._id || request.id).toString(),
          businessName: request.businessName,
          clientName: clientName,
          email: clientEmail,
          phone: clientPhone,
          originalFilename: file.originalname,
          fileType: detectedType,
          mimeType: mime,
          fileSize: file.size,
          cloudinaryPublicId: uploadResult.publicId,
          cloudinaryUrl: uploadResult.url,
          status: 'Completed',
          notes: clientNotes,
          uploadedBy: 'client_portal'
        });

        savedAssets.push(asset);
      }

      // Update AssetRequest status to Completed
      await dbUpdateAssetRequest(token, { status: 'Completed' });

      // Notify admin dashboard in real-time
      broadcast({
        type: 'asset-uploaded',
        data: {
          businessName: request.businessName,
          clientName: clientName,
          filesCount: savedAssets.length,
          timestamp: new Date().toISOString()
        }
      });

      res.writeHead(200, { 'Content-Type': 'application/json' });
      res.end(JSON.stringify({
        success: true,
        receiptId: Math.random().toString(36).substring(2, 9).toUpperCase(),
        uploadedCount: savedAssets.length,
        assets: savedAssets
      }));
      return;
    }

    // GET /api/admin/assets/requests
    if (req.method === 'GET' && pathname === '/api/admin/assets/requests') {
      if (!isAuthorizedAdmin(req, urlObj)) {
        res.statusCode = 401;
        res.setHeader('Content-Type', 'application/json');
        res.end(JSON.stringify({ error: 'Unauthorized' }));
        return;
      }
      const list = await dbGetAssetRequests();
      res.writeHead(200, { 'Content-Type': 'application/json' });
      res.end(JSON.stringify(list));
      return;
    }

    // POST /api/admin/assets/requests
    if (req.method === 'POST' && pathname === '/api/admin/assets/requests') {
      if (!isAuthorizedAdmin(req, urlObj)) {
        res.statusCode = 401;
        res.setHeader('Content-Type', 'application/json');
        res.end(JSON.stringify({ error: 'Unauthorized' }));
        return;
      }
      const body = await getRequestBody(req);
      const bName = sanitize(body.businessName || '');

      if (!bName) {
        res.statusCode = 400;
        res.setHeader('Content-Type', 'application/json');
        res.end(JSON.stringify({ error: 'Business name is required' }));
        return;
      }

      const rToken = Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15);
      const requestData = {
        token: rToken,
        businessName: bName,
        clientName: sanitize(body.clientName || ''),
        email: sanitize(body.email || ''),
        phone: sanitize(body.phone || ''),
        notes: sanitize(body.notes || ''),
        relatedProjectId: sanitize(body.relatedProjectId || ''),
        maxUploadSize: Number(body.maxUploadSize || 104857600), // 100MB
        allowedFileTypes: body.allowedFileTypes || ['images', 'videos', 'documents'],
        expirationDate: body.expirationDate ? new Date(body.expirationDate) : undefined,
        status: 'Waiting for Upload'
      };

      const newRequest = await dbCreateAssetRequest(requestData);
      res.writeHead(201, { 'Content-Type': 'application/json' });
      res.end(JSON.stringify(newRequest));
      return;
    }

    // DELETE /api/admin/assets/requests/:id
    const deleteRequestMatch = pathname.match(/^\/api\/admin\/assets\/requests\/([^/]+)$/);
    if (req.method === 'DELETE' && deleteRequestMatch) {
      if (!isAuthorizedAdmin(req, urlObj)) {
        res.statusCode = 401;
        res.setHeader('Content-Type', 'application/json');
        res.end(JSON.stringify({ error: 'Unauthorized' }));
        return;
      }
      const id = deleteRequestMatch[1];
      const deleted = await dbDeleteAssetRequest(id);
      if (!deleted) {
        res.statusCode = 404;
        res.setHeader('Content-Type', 'application/json');
        res.end(JSON.stringify({ error: 'Request not found' }));
        return;
      }
      res.writeHead(200, { 'Content-Type': 'application/json' });
      res.end(JSON.stringify({ success: true, deleted }));
      return;
    }

    // GET /api/admin/assets
    if (req.method === 'GET' && pathname === '/api/admin/assets') {
      if (!isAuthorizedAdmin(req, urlObj)) {
        res.statusCode = 401;
        res.setHeader('Content-Type', 'application/json');
        res.end(JSON.stringify({ error: 'Unauthorized' }));
        return;
      }
      const list = await dbGetUploadedAssets();
      res.writeHead(200, { 'Content-Type': 'application/json' });
      res.end(JSON.stringify(list));
      return;
    }

    // DELETE /api/admin/assets/group/:businessName
    const deleteGroupMatch = pathname.match(/^\/api\/admin\/assets\/group\/([^/]+)$/);
    if (req.method === 'DELETE' && deleteGroupMatch) {
      if (!isAuthorizedAdmin(req, urlObj)) {
        res.statusCode = 401;
        res.setHeader('Content-Type', 'application/json');
        res.end(JSON.stringify({ error: 'Unauthorized' }));
        return;
      }
      const businessName = decodeURIComponent(deleteGroupMatch[1]);
      const deletedAssets = await dbDeleteAssetsByBusiness(businessName);

      // Clean up files from disk
      for (const asset of deletedAssets) {
        if (asset.cloudinaryUrl.includes('/public/uploads/')) {
          const filename = path.basename(asset.cloudinaryUrl);
          const filePath = path.join(UPLOADS_DIR, filename);
          if (fs.existsSync(filePath)) {
            try { fs.unlinkSync(filePath); } catch (e) {}
          }
        } else if (asset.cloudinaryPublicId && isCloudinaryConfigured) {
          try {
            await cloudinary.uploader.destroy(asset.cloudinaryPublicId);
          } catch (e) {
            console.error('Failed to destroy Cloudinary asset:', e);
          }
        }
      }

      res.writeHead(200, { 'Content-Type': 'application/json' });
      res.end(JSON.stringify({ success: true, deletedCount: deletedAssets.length }));
      return;
    }

    // GET /api/admin/assets/download-all/:businessName
    const downloadAllMatch = pathname.match(/^\/api\/admin\/assets\/download-all\/([^/]+)$/);
    if (req.method === 'GET' && downloadAllMatch) {
      if (!isAuthorizedAdmin(req, urlObj)) {
        res.statusCode = 401;
        res.setHeader('Content-Type', 'application/json');
        res.end(JSON.stringify({ error: 'Unauthorized' }));
        return;
      }
      const businessName = decodeURIComponent(downloadAllMatch[1]);
      const assets = await dbGetUploadedAssets();
      const filtered = assets.filter(a => a.businessName === businessName && a.status === 'Completed');

      res.writeHead(200, {
        'Content-Disposition': `attachment; filename="${businessName.replace(/[^a-zA-Z0-9-_]/g, '_')}-assets.zip"`,
        'Content-Type': 'application/zip'
      });

      const archive = archiver('zip', { zlib: { level: 9 } });
      archive.on('error', (err) => {
        console.error('Archiver error:', err);
        res.end();
      });

      archive.pipe(res);

      const https = await import('node:https');
      const httpModule = await import('node:http');

      function getRemoteStream(url: string): Promise<any> {
        return new Promise((resolve, reject) => {
          const client = url.startsWith('https') ? https : httpModule;
          client.get(url, (response) => {
            if (response.statusCode === 200) {
              resolve(response);
            } else {
              reject(new Error(`Status ${response.statusCode}`));
            }
          }).on('error', reject);
        });
      }

      for (const asset of filtered) {
        let folder = 'Documents';
        if (asset.fileType === 'image') folder = 'Images';
        if (asset.fileType === 'video') folder = 'Videos';

        const entryName = `${folder}/${asset.originalFilename}`;

        if (asset.cloudinaryUrl.includes('/public/uploads/')) {
          const filename = path.basename(asset.cloudinaryUrl);
          const filePath = path.join(UPLOADS_DIR, filename);
          if (fs.existsSync(filePath)) {
            archive.file(filePath, { name: entryName });
          }
        } else {
          try {
            const stream = await getRemoteStream(asset.cloudinaryUrl);
            archive.append(stream, { name: entryName });
          } catch (e) {
            console.error(`Failed to stream remote file ${asset.cloudinaryUrl}:`, e);
          }
        }
      }

      await archive.finalize();
      return;
    }

    // DELETE /api/admin/assets/:id
    const deleteAssetMatch = pathname.match(/^\/api\/admin\/assets\/([^/]+)$/);
    if (req.method === 'DELETE' && deleteAssetMatch) {
      if (!isAuthorizedAdmin(req, urlObj)) {
        res.statusCode = 401;
        res.setHeader('Content-Type', 'application/json');
        res.end(JSON.stringify({ error: 'Unauthorized' }));
        return;
      }
      const id = deleteAssetMatch[1];
      if (id !== 'requests' && id !== 'group' && id !== 'download-all') {
        const deleted = await dbDeleteUploadedAsset(id);
        if (!deleted) {
          res.statusCode = 404;
          res.setHeader('Content-Type', 'application/json');
          res.end(JSON.stringify({ error: 'Asset not found' }));
          return;
        }

        // Clean up file
        if (deleted.cloudinaryUrl.includes('/public/uploads/')) {
          const filename = path.basename(deleted.cloudinaryUrl);
          const filePath = path.join(UPLOADS_DIR, filename);
          if (fs.existsSync(filePath)) {
            try { fs.unlinkSync(filePath); } catch (e) {}
          }
        } else if (deleted.cloudinaryPublicId && isCloudinaryConfigured) {
          try {
            await cloudinary.uploader.destroy(deleted.cloudinaryPublicId);
          } catch (e) {
            console.error('Failed to destroy Cloudinary asset:', e);
          }
        }

        res.writeHead(200, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify({ success: true, deleted }));
        return;
      }
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
