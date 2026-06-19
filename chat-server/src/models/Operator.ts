import mongoose, { Document, Schema } from 'mongoose';

export interface IOperator extends Document {
  name: string;
  email: string;
  role: 'Super Admin' | 'Supervisor' | 'Manager' | 'Developer' | 'Viewer';
  status: 'Active' | 'Inactive';
  joinedDate: string;
  username?: string;
  password?: string;
}

const OperatorSchema = new Schema<IOperator>(
  {
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    role: { type: String, enum: ['Super Admin', 'Supervisor', 'Manager', 'Developer', 'Viewer'], default: 'Developer' },
    status: { type: String, enum: ['Active', 'Inactive'], default: 'Active' },
    joinedDate: { type: String, required: true },
    username: { type: String },
    password: { type: String }
  },
  { timestamps: true }
);

if (mongoose.models.Operator) {
  delete (mongoose.models as any).Operator;
}
export const Operator = mongoose.model<IOperator>('Operator', OperatorSchema);
