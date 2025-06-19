import type { IUserAuth, Role } from '@/models/auth.model';
import { IUserProfile } from '@/models/profile.model';
import mongoose from 'mongoose';
import { type JwtPayload } from 'jsonwebtoken';

export interface IUser {
  sub: string;
  username: string;
  email: string;
  roles: Role[];
  profile: {
    displayName: string;
    avatarURL?: string;
  };
}

export interface IUserDBInfo extends IUserAuth {
  _id: mongoose.Types.ObjectId;
  profile: IUserProfile;
}

export interface IUserTokenPayload extends JwtPayload {
  sub: string;
  email: string;
  username: string;
}

export interface INewUser {
  firstName: string;
  lastName: string;
  email: string;
  username: string;
  password: string;
  avatarURL?: string;
}
