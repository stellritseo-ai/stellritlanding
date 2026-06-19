import mongoose, { Document, Schema } from 'mongoose';

export interface ISiteConfig extends Document {
  productionUrl: string;
  avgSeoRank: string;
  keywordsTracked: number;
  coreWebVitals: number;
  maintenanceMode: boolean;
  aiHelpdeskAutoplay: boolean;
  edgeCacheCompression: boolean;
  dynamicCaseStudies: boolean;
}

const SiteConfigSchema = new Schema<ISiteConfig>(
  {
    productionUrl: { type: String, default: 'stellrit.com' },
    avgSeoRank: { type: String, default: '#4 Sector Avg' },
    keywordsTracked: { type: Number, default: 42 },
    coreWebVitals: { type: Number, default: 96 },
    maintenanceMode: { type: Boolean, default: false },
    aiHelpdeskAutoplay: { type: Boolean, default: true },
    edgeCacheCompression: { type: Boolean, default: true },
    dynamicCaseStudies: { type: Boolean, default: false }
  },
  { timestamps: true }
);

export const SiteConfig = mongoose.model<ISiteConfig>('SiteConfig', SiteConfigSchema);

