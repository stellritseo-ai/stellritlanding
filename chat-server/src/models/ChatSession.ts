import mongoose, { Document, Schema } from 'mongoose';

export interface IChatSession extends Document {
  visitorId: string;
  visitorName: string;
  visitorPhoneOrEmail: string;
  status: 'open' | 'closed';
  createdAt: Date;
  updatedAt: Date;
}

const ChatSessionSchema = new Schema<IChatSession>(
  {
    visitorId: { type: String, required: true, index: true },
    visitorName: { type: String, default: 'Visitor' },
    visitorPhoneOrEmail: { type: String, default: '' },
    status: { type: String, enum: ['open', 'closed'], default: 'open' },
  },
  { timestamps: true }
);

export const ChatSession = mongoose.model<IChatSession>('ChatSession', ChatSessionSchema);
