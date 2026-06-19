import mongoose, { Document, Schema } from 'mongoose';

export interface IAssetRequest extends Document {
  token: string;
  businessName: string;
  clientName?: string;
  email?: string;
  phone?: string;
  notes?: string;
  relatedProjectId?: string;
  maxUploadSize: number;
  allowedFileTypes: string[];
  expirationDate?: Date;
  status: 'Waiting for Upload' | 'Completed' | 'Expired';
  createdAt: Date;
  updatedAt: Date;
}

const AssetRequestSchema = new Schema<IAssetRequest>(
  {
    token: { type: String, required: true, unique: true, index: true },
    businessName: { type: String, required: true },
    clientName: { type: String },
    email: { type: String },
    phone: { type: String },
    notes: { type: String },
    relatedProjectId: { type: String },
    maxUploadSize: { type: Number, default: 104857600 }, // default 100MB
    allowedFileTypes: { type: [String], default: ['images', 'videos', 'documents'] },
    expirationDate: { type: Date },
    status: { type: String, default: 'Waiting for Upload', enum: ['Waiting for Upload', 'Completed', 'Expired'] },
  },
  { timestamps: true }
);

export const AssetRequest = mongoose.model<IAssetRequest>('AssetRequest', AssetRequestSchema);
