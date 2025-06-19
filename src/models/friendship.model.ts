import mongoose, { Schema, type Document, type Model } from 'mongoose';

export type FriendshipStatus = 'pending' | 'accepted' | 'rejected' | 'blocked';

export interface IFriendship extends Document {
  senderId: mongoose.Types.ObjectId;
  receiverId: mongoose.Types.ObjectId;
  status: FriendshipStatus;
  respondedAt?: Date;
  createdAt: Date;
  updatedAt: Date;
}

const friendshipSchema = new Schema<IFriendship>(
  {
    senderId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Profile',
      required: true
    },
    receiverId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Profile',
      required: true
    },
    status: {
      type: String,
      enum: ['pending', 'accepted', 'rejected', 'blocked'],
      default: 'pending'
    },
    respondedAt: {
      type: Date
    }
  },
  {
    timestamps: true
  }
);

// ❗ Prevent duplicate friendship requests from the same sender to the same receiver
friendshipSchema.index({ senderId: 1, receiverId: 1 }, { unique: true });

// ❗ Prevent sending a request to self
friendshipSchema.pre('validate', function (next) {
  if (this.senderId.equals(this.receiverId)) {
    this.invalidate('receiverId', 'Sender and receiver cannot be the same.');
  }
  next();
});

const FriendshipModel: Model<IFriendship> = mongoose.model<IFriendship>('Friendship', friendshipSchema);

export default FriendshipModel;
