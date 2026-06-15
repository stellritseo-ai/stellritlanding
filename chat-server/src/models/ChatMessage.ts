import mongoose, { Document, Schema, Types } from 'mongoose';

export interface IChatMessage extends Document {
  sessionId: Types.ObjectId;
  senderType: 'visitor' | 'admin';
  message: string;
  createdAt: Date;
  readAt: Date | null;
}

const ChatMessageSchema = new Schema<IChatMessage>(
  {
    sessionId: {
      type: Schema.Types.ObjectId,
      ref: 'ChatSession',
      required: true,
      index: true,
    },
    senderType: { type: String, enum: ['visitor', 'admin'], required: true },
    message: { type: String, required: true, maxlength: 2000 },
    readAt: { type: Date, default: null },
  },
  { timestamps: true }
);

export const ChatMessage = mongoose.model<IChatMessage>('ChatMessage', ChatMessageSchema);
