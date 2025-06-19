import mongoose, { Document, Model, Schema } from 'mongoose';
import { getEnvNumber } from '@/configs/env.config';

// ===========================
// Interface for LoginHistory
// ===========================
export interface ILoginHistory extends Document {
  userId: mongoose.Types.ObjectId;
  ipAddress?: string;
  userAgent?: string;
  deviceId?: string;
  method: 'password' | 'google' | 'github' | 'facebook';
  status: 'success' | 'failed' | 'locked';
  createdAt: Date;
  updatedAt: Date;
}

// =====================
// Schema Configuration
// =====================
const loginHistorySchema = new Schema<ILoginHistory>(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Profile', // 👈 Ensure 'Profile' is correct; change to 'Auth' if needed
      required: true
    },
    ipAddress: {
      type: String
    },
    userAgent: {
      type: String
    },
    deviceId: {
      type: String
    },
    method: {
      type: String,
      enum: ['password', 'google', 'github', 'facebook'],
      required: true
    },
    status: {
      type: String,
      enum: ['success', 'failed', 'locked'],
      required: true
    },
    createdAt: {
      type: Date,
      default: Date.now,
      // Safe parsing with fallback
      expires: (() => {
        const val = getEnvNumber("LOGIN_HISTORY_EXPIRES_IN");
        return val;
      })()
    }
  },
  {
    timestamps: true
  }
);

// ==========
// Indexes
// ==========
loginHistorySchema.index({ userId: 1 });
loginHistorySchema.index({ status: 1 });
loginHistorySchema.index({ method: 1 });

// ==========
// Model
// ==========
export const LoginHistoryModel: Model<ILoginHistory> = mongoose.model<ILoginHistory>(
  'LoginHistory',
  loginHistorySchema
);
