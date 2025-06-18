import mongoose, { Schema, type Document, type Model } from 'mongoose';

export type MessageContentType = 'text' | 'image' | 'video' | 'audio' | 'file';

export interface IMessage extends Document {
  sender: mongoose.Types.ObjectId;
  chat: mongoose.Types.ObjectId;
  content: string; // actual message text or media URL
  contentType: MessageContentType;
  readBy: mongoose.Types.ObjectId[];
  createdAt: Date;
  updatedAt: Date;
}

const messageSchema = new Schema<IMessage>(
  {
    sender: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Profile',
      required: true
    },
    chat: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Chat',
      required: true
    },
    content: {
      type: String,
      required: true,
      trim: true
    },
    contentType: {
      type: String,
      enum: ['text', 'image', 'video', 'audio', 'file'],
      default: 'text',
      required: true
    },
    readBy: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Profile'
      }
    ]
  },
  {
    timestamps: true,
    toJSON: { virtuals: true },
    toObject: { virtuals: true }
  }
);

const MessageModel: Model<IMessage> = mongoose.model<IMessage>('Message', messageSchema);

export default MessageModel;