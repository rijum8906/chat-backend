import mongoose, { Schema, type Document, type Model } from 'mongoose';

export interface IChatSchema extends Document {
  chatName?: string;
  isGroupChat: boolean;
  participants: { profileId: mongoose.Schema.Types.ObjectId }[];
  createdBy: mongoose.Schema.Types.ObjectId;
  groupAdmins?: mongoose.Schema.Types.ObjectId[];
  latestMessage: mongoose.Schema.Types.ObjectId;
}

const chatSchema = new Schema<IChatSchema>(
  {
    chatName: {
      type: String,
      trim: true,
      required: function () {
        return this.isGroupChat;
      }
    },
    isGroupChat: {
      type: Boolean,
      default: false
    },
    participants: [
      {
        profileId: {
          type: mongoose.Schema.Types.ObjectId,
          ref: 'Profile',
          required: true
        }
      }
    ],
    createdBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Profile',
      required: true
    },
    groupAdmins: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Profile'
      }
    ],
    latestMessage: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Message'
    }
  },
  {
    timestamps: true,
    toJSON: { virtuals: true },
    toObject: { virtuals: true }
  }
);


const ChatModel: Model<IChatSchema> = mongoose.model<IChatSchema>('Chat', chatSchema);
export default ChatModel;