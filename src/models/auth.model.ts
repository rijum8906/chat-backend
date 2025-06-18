import mongoose, { Schema, type Document, type Model } from 'mongoose';
import bcrypt from 'bcryptjs';
import crypto from 'crypto';

// ======================
// INTERFACE DEFINITIONS
// ======================

interface ISocialLogin {
  id?: string;
  email?: string;
}

interface ILastLogin {
  timestamp: Date;
  ipAddress?: string;
  deviceId?: string;
}

interface ISession {
  token: string;
  ipAddress?: string;
  userAgent?: string;
  deviceId?: string;
  createdAt: Date;
  lastUsed: Date;
}

interface IFailedLoginAttempt {
  ipAddress?: string;
  userAgent?: string;
  timestamp: Date;
}

export interface IUserAuthMethods {
  comparePassword(candidatePassword: string): Promise<boolean>;
  createPasswordResetToken(): string;
  addSession(sessionInfo: ISession): void;
  incrementLoginAttempts(deviceInfo: {
    ipAddress?: string;
    userAgent?: string;
  }): void;
}

type Role = "user" | "admin";

export interface IUserAuth extends Document, IUserAuthMethods {
  // Core Auth Fields
  email: string;
  password?: string;
  username: string;
  roles: Role[]

  // Account Security
  passwordChangedAt?: Date;
  passwordResetToken?: string;
  passwordResetTokenExpires?: Date;
  isTFAEnabled: boolean;
  TFASecret?: string;

  // Social Logins
  socialLogins: {
    google?: ISocialLogin;
    github?: ISocialLogin;
  };

  // Login Information
  lastLogin: ILastLogin;
  activeSessions: ISession[];

  // Account Status
  registrationMethod: 'password' | 'google' | 'github' | 'facebook';
  isEmailVerified: boolean;
  isActive: boolean;
  isLocked: boolean;
  failedLoginAttempts: IFailedLoginAttempt[];
  lockUntil?: Date;

  // Linked Schemas
  profileId: mongoose.Types.ObjectId;

  // Methods
  comparePassword(candidatePassword: string): Promise<boolean>;
  createPasswordResetToken(): string;
  addSession(sessionInfo: ISession): void;
  incrementLoginAttempts(deviceInfo: { ipAddress?: string; userAgent?: string }): void;
}

// ======================
// SCHEMA DEFINITION
// ======================

const userAuthSchema: Schema = new Schema(
  {
    // --- Core Auth Fields ---
    email: {
      type: String,
      required: [true, 'Email is required'],
      trim: true,
      lowercase: true
    },
    password: {
      type: String,
      minlength: [8, 'Password must be at least 8 characters']
    },
    username: {
      type: String,
      required: [true, 'Username is required'],
      trim: true,
      match: [
        /^[a-z0-9_]+$/,
        'Username must be lowercase alphanumeric + underscores'
      ],
      minlength: 3,
      maxlength: 30
    },
    roles: {
      type: [String],
      enum: ['user', 'admin'],
      default: ['user']
    },

    // --- Account Security ---
    passwordChangedAt: Date,
    passwordResetToken: String,
    passwordResetTokenExpires: Date,
    isTFAEnabled: {
      type: Boolean,
      default: false
    },
    TFASecret: {
      type: String,
      select: false
    },

    // --- Social Logins ---
    socialLogins: {
      google: {
        id: { type: String },
        email: String
      },
      github: {
        id: { type: String },
        email: String
      }
    },

    // --- Login Information ---
    lastLogin: {
      timestamp: {
        type: Date,
        default: Date.now
      },
      ipAddress: String,
      deviceId: String
    },
    activeSessions: [
      {
        token: String,
        ipAddress: String,
        userAgent: String,
        deviceId: String,
        createdAt: {
          type: Date,
          default: Date.now
        },
        lastUsed: {
          type: Date,
          default: Date.now
        }
      }
    ],

    // --- Account Status ---
    registrationMethod: {
      type: String,
      enum: ['password', 'google', 'github', 'facebook'],
      default: 'password'
    },
    isEmailVerified: {
      type: Boolean,
      default: false
    },
    isActive: {
      type: Boolean,
      default: true
    },
    isLocked: {
      type: Boolean,
      default: false
    },
    failedLoginAttempts: [
      {
        ipAddress: String,
        userAgent: String,
        timestamp: {
          type: Date,
          default: Date.now
        }
      }
    ],
    lockUntil: Date,

    // --- Linked Schemas ---
    profileId: {
      type: Schema.Types.ObjectId,
      ref: 'Profile',
      required: true
    }
  },
  {
    timestamps: true,
    toJSON: { virtuals: true },
    toObject: { virtuals: true }
  }
);

// ======================
// MIDDLEWARE & METHODS
// ======================

// --- Password Hashing ---
userAuthSchema.pre<IUserAuth>('save', async function (next) {
  if (!this.isModified('password')) return next();

  try {
    if (this.password) {
      this.password = await bcrypt.hash(this.password, 12);
      if (!this.isNew) this.passwordChangedAt = new Date(Date.now() - 1000); // 1 sec ago
    }
    next();
  } catch (err) {
    next(err as Error);
  }
});

// --- Password Comparison ---
userAuthSchema.methods.comparePassword = async function (
  this: IUserAuth,
  candidatePassword: string
): Promise<boolean> {
  if (this.password) {
    return await bcrypt.compare(candidatePassword, this.password);
  }
  return false;
};

// --- Password Reset Token ---
userAuthSchema.methods.createPasswordResetToken = function (
  this: IUserAuth
): string {
  const resetToken = crypto.randomBytes(32).toString('hex');
  this.passwordResetToken = crypto
    .createHash('sha256')
    .update(resetToken)
    .digest('hex');
  this.passwordResetTokenExpires = new Date(Date.now() + 10 * 60 * 1000); // 10 minutes

  return resetToken;
};

// --- Add/Update Sessions on Login ---
userAuthSchema.methods.addSession = function (
  this: IUserAuth,
  sessionInfo: ISession
): void {
  // Find existing session for this device
  const existingSessionIndex = this.activeSessions.findIndex(
    (session) => session.deviceId === sessionInfo.deviceId
  );

  if (existingSessionIndex >= 0) {
    // Update existing session
    this.activeSessions[existingSessionIndex].lastUsed = new Date();
  } else {
    // Add new session
    this.activeSessions.push(sessionInfo);
  }
};

// --- Account Locking for Brute Force ---
userAuthSchema.methods.incrementLoginAttempts = function (
  this: IUserAuth,
  deviceInfo: { ipAddress?: string; userAgent?: string }
): void {
  // Implementation for login attempts tracking
  this.failedLoginAttempts.push({
    ipAddress: deviceInfo.ipAddress,
    userAgent: deviceInfo.userAgent,
    timestamp: new Date()
  });
};

// --- Indexes ---
userAuthSchema.index({ email: 1 }, { unique: true });
userAuthSchema.index({ username: 1 }, { unique: true });
userAuthSchema.index({ 'socialLogins.google.id': 1 });
userAuthSchema.index({ 'socialLogins.github.id': 1 });

// ======================
// MODEL DEFINITION
// ======================

const AuthModel: Model<IUserAuth> = mongoose.model<IUserAuth>('Auth', userAuthSchema);

export default AuthModel;