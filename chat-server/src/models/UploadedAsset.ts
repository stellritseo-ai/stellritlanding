import mongoose, { Document, Schema } from 'mongoose';

export interface IUploadedAsset extends Document {
  requestId?: string;
  businessName: string;
  clientName?: string;
  email?: string;
  phone?: string;
  originalFilename: string;
  fileType: 'image' | 'video' | 'document';
  mimeType?: string;
  fileSize: number;
  cloudinaryPublicId?: string;
  cloudinaryUrl: string;
  status: 'Completed' | 'Failed';
  notes?: string;
  uploadedBy: string;
  createdAt: Date;
  updatedAt: Date;
}

const UploadedAssetSchema = new Schema<IUploadedAsset>(
  {
    requestId: { type: String, index: true },
    businessName: { type: String, required: true },
    clientName: { type: String },
    email: { type: String },
    phone: { type: String },
    originalFilename: { type: String, required: true },
    fileType: { type: String, required: true, enum: ['image', 'video', 'document'] },
    mimeType: { type: String },
    fileSize: { type: Number, required: true },
    cloudinaryPublicId: { type: String },
    cloudinaryUrl: { type: String, required: true },
    status: { type: String, default: 'Completed', enum: ['Completed', 'Failed'] },
    notes: { type: String },
    uploadedBy: { type: String, default: 'client_portal' },
  },
  { timestamps: true }
);

export const UploadedAsset = mongoose.model<IUploadedAsset>('UploadedAsset', UploadedAssetSchema);
