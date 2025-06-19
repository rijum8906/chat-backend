import mongoose, { Document, Schema, Model } from 'mongoose';

export interface IUserProfile extends Document {
  firstName: string;
  lastName: string;
  displayName: string;
  location?: string;
  ipAddress: string;
  avatarURL?: string;
  bio?: string;
}

const userProfileSchema: Schema<IUserProfile> = new Schema(
  {
    firstName: {
      type: String,
      required: [true, 'First name is required'],
      trim: true,
      minlength: 2,
      maxlength: 50
    },
    lastName: {
      type: String,
      required: [true, 'Last name is required'],
      trim: true,
      minlength: 2,
      maxlength: 50
    },
    displayName: {
      type: String,
      default: function () {
        return this.firstName;
      }
    },
    location: String,
    ipAddress: {
      type: String,
      required: true
    },
    avatarURL: String,
    bio: String
  },
  {
    timestamps: true
  }
);

export const ProfileModel: Model<IUserProfile> = mongoose.model<IUserProfile>('Profile', userProfileSchema);
