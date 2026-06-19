import mongoose, { Document, Schema } from 'mongoose';

export interface IProject extends Document {
  clientName: string;
  projectName: string;
  businessName: string;
  salesDate: string;
  ownerName: string;
  domainName: string;
  phoneNumber: string;
  projectCost: number;
  accountSetup: number;
  firstInstallment: number;
  secondInstallment: number;
  thirdInstallment: number;
  hostingFee: number;
  closeBy: string;
  cardDetails: string;
  projectDetails: string;
  isCompleted: boolean;
  color: string;
  createdAt: Date;
  updatedAt: Date;
}

const ProjectSchema = new Schema<IProject>(
  {
    clientName: { type: String, required: true },
    projectName: { type: String, required: true },
    businessName: { type: String, default: '' },
    salesDate: { type: String, default: '' },
    ownerName: { type: String, default: '' },
    domainName: { type: String, default: '' },
    phoneNumber: { type: String, default: '' },
    projectCost: { type: Number, default: 0 },
    accountSetup: { type: Number, default: 0 },
    firstInstallment: { type: Number, default: 0 },
    secondInstallment: { type: Number, default: 0 },
    thirdInstallment: { type: Number, default: 0 },
    hostingFee: { type: Number, default: 0 },
    closeBy: { type: String, default: '' },
    cardDetails: { type: String, default: '' },
    projectDetails: { type: String, default: '' },
    isCompleted: { type: Boolean, default: false },
    color: { type: String, default: 'from-purple-500 to-indigo-500' },
  },
  { timestamps: true }
);

export const Project = mongoose.model<IProject>('Project', ProjectSchema);
