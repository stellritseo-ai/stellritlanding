import mongoose, { Document, Schema } from 'mongoose';

export interface IOperator extends Document {
  name: string;
  email: string;
  role: 'Super Admin' | 'Developer' | 'Analyst';
  status: 'Active' | 'Inactive';
  joinedDate: string;
  username?: string;
  password?: string;
}

const OperatorSchema = new Schema<IOperator>(
  {
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    role: { type: String, enum: ['Super Admin', 'Developer', 'Analyst'], default: 'Developer' },
    status: { type: String, enum: ['Active', 'Inactive'], default: 'Active' },
    joinedDate: { type: String, required: true },
    username: { type: String },
    password: { type: String }
  },
  { timestamps: true }
);

export const Operator = mongoose.model<IOperator>('Operator', OperatorSchema);
