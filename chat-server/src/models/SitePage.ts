import mongoose, { Document, Schema } from 'mongoose';

export interface ISitePage extends Document {
  path: string;
  title: string;
  status: 'Published' | 'Draft';
  speedScore: number;
}

const SitePageSchema = new Schema<ISitePage>(
  {
    path: { type: String, required: true, unique: true },
    title: { type: String, required: true },
    status: { type: String, enum: ['Published', 'Draft'], default: 'Draft' },
    speedScore: { type: Number, default: 0 }
  },
  { timestamps: true }
);

export const SitePage = mongoose.model<ISitePage>('SitePage', SitePageSchema);
