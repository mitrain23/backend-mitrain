import prisma from '../utils/prisma'
import { response } from "express";

const mongoose = require('mongoose');

const messageSchema = new mongoose.Schema({
  content: { type: String, required: true },
  sender: { type: String, required: true }, 
  chat: { type: mongoose.Schema.Types.ObjectId, ref: "Chat" },
  isRead: { type: Boolean, default: false},
}, { timestamps: true });

const chatSchema = new mongoose.Schema({
  chatName: { type: String, required: true },
  isGroupChat: { type: Boolean, default: false },
  product_Id: { type: String, required: true },
  users: [{ type: String, required: true }],
  latestMessage: { type: mongoose.Schema.Types.ObjectId, ref: 'Message' },
  groupAdmin: { type: String },
}, { timestamps: true });

export const Message = mongoose.model('Message', messageSchema);
export const Chat = mongoose.model('Chat', chatSchema);

// Assuming userId is the common identifier
export async function usersExist(userIds: string[]) {
  try {
    const users = await prisma.user.findMany({
      where: {
        id: {
          in: userIds,
        },
      },
    });

    // Check if all user IDs were found
    const allUserIdsFound = users.length === userIds.length;

    if (!allUserIdsFound) {
      throw new Error('Not all user IDs were found');
    }

    return true;
  } catch (error: any) {
    console.error('Error checking user existence:', error.message);
    throw error;
  }
}


// module.exports = { Message, Chat, userExists };
