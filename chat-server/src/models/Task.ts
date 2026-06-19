import mongoose, { Document, Schema } from 'mongoose';

export interface ITaskAttachment {
  name: string;
  url: string;
  type?: string;
}

export interface ITaskChecklistItem {
  text: string;
  completed: boolean;
}

export interface ITaskComment {
  id: string;
  userId: string;
  userName: string;
  userAvatar?: string;
  content: string;
  createdAt: Date;
}

export interface ITaskActivity {
  action: string;
  performedBy: string;
  timestamp: Date;
}

export interface ITask extends Document {
  title: string;
  projectName: string;
  businessName: string;
  assignedUsers: string[];
  priority: 'Low' | 'Medium' | 'High' | 'Urgent';
  status: 'To Do' | 'Ongoing' | 'Done' | 'Work Failed' | 'Domain Book';
  tags: string[];
  description: string;
  businessInfo?: {
    businessName?: string;
    contactPerson?: string;
    phoneNumber?: string;
    email?: string;
    website?: string;
    requirements?: string[];
  };
  domainInfo?: {
    domainName?: string;
  };
  attachments: ITaskAttachment[];
  checklist: ITaskChecklistItem[];
  comments: ITaskComment[];
  activityHistory: ITaskActivity[];
  relatedProjectId: string;
  createdBy: string;
  orderIndex: number;
  createdAt: Date;
  updatedAt: Date;
}

const TaskSchema = new Schema<ITask>(
  {
    title: { type: String, required: true },
    projectName: { type: String, default: '' },
    businessName: { type: String, default: '' },
    assignedUsers: { type: [String], default: [] },
    priority: { type: String, enum: ['Low', 'Medium', 'High', 'Urgent'], default: 'Medium' },
    status: { type: String, enum: ['To Do', 'Ongoing', 'Done', 'Work Failed', 'Domain Book'], default: 'To Do' },
    tags: { type: [String], default: [] },
    description: { type: String, default: '' },
    businessInfo: {
      businessName: { type: String, default: '' },
      contactPerson: { type: String, default: '' },
      phoneNumber: { type: String, default: '' },
      email: { type: String, default: '' },
      website: { type: String, default: '' },
      requirements: { type: [String], default: [] }
    },
    domainInfo: {
      domainName: { type: String, default: '' }
    },
    attachments: [
      {
        name: { type: String, required: true },
        url: { type: String, required: true },
        type: { type: String }
      }
    ],
    checklist: [
      {
        text: { type: String, required: true },
        completed: { type: Boolean, default: false }
      }
    ],
    comments: [
      {
        id: { type: String, required: true },
        userId: { type: String, required: true },
        userName: { type: String, required: true },
        userAvatar: { type: String, default: '' },
        content: { type: String, required: true },
        createdAt: { type: Date, default: Date.now }
      }
    ],
    activityHistory: [
      {
        action: { type: String, required: true },
        performedBy: { type: String, required: true },
        timestamp: { type: Date, default: Date.now }
      }
    ],
    relatedProjectId: { type: String, default: '' },
    createdBy: { type: String, default: '' },
    orderIndex: { type: Number, default: 0 }
  },
  { timestamps: true }
);

export const Task = mongoose.model<ITask>('Task', TaskSchema);
