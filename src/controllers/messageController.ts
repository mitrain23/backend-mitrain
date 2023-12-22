import { Request, Response } from 'express'
import { Chat, Message, usersExist } from '../mongoose/models';
var ObjectId = require('mongoose').Types.ObjectId;
import prisma from '../utils/prisma'
import { processChatData } from './chatController';


class MessageController {

  //@description     Get all Messages
  //@route           GET /api/Message/:chatId
  //@access          Protected
  static async allMessages(req: Request, res: Response) {
    try {
      const isChatExist = await Chat.findOne({
        _id: new ObjectId(req.params.chatId)
      });

      if (!isChatExist) {
        console.log("Invalid chat Id");
        return res.status(400).send({ message: "Invalid chat Id" });
      }

      let messages = await Message.find({ chat: req.params.chatId }).populate("chat");

      // Convert messages to plain objects to modify sender and users fields
      const messagesData = messages.map((message: { toObject: () => any; }) => message.toObject());

      for (const message of messagesData) {
        // Retrieve sender's user data from Prisma
        const senderUserData = await prisma.user.findUnique({
          where: {
            id: message.sender,
          },
          select: {
            id: true,
            name: true,
            email: true,
            images: {
              select: {
                id: true,
                userId: true,
                postId: true,
                url: true,
              },
            },
          },
        });

        if (!senderUserData) {
          // Handle the case where senderUserData is null (sender not found)
          console.log("Sender not found");
          return res.status(404).send({ message: "Sender not found" });
        }

        // Retrieve chat's user data from Prisma
        const chatUserData = await prisma.user.findMany({
          where: {
            id: {
              in: isChatExist.users, // Assuming isChatExist has 'users' field
            },
          },
          select: {
            id: true,
            name: true,
            email: true,
            images: {
              select: {
                id: true,
                userId: true,
                postId: true,
                url: true,
              },
            },
          },
        });

        // Update sender and users fields with the retrieved data
        message.sender = {
          id: senderUserData.id,
          name: senderUserData.name,
          email: senderUserData.email,
          images: senderUserData.images,
        };

        message.chat.users = chatUserData.map((user) => ({
          id: user.id,
          name: user.name,
          email: user.email,
          images: user.images,
        }));
      }

      res.status(200).json({ data: messagesData });
    } catch (error: any) {
      res.status(500).json({ error: error.message });
    }
  }

  //@description     Create New Message
  //@route           POST /api/Message/
  //@access          Protected
  static async sendMessage(req: Request, res: Response) {
    try {
      const { content, chatId } = req.body;
      if (!content || !chatId) {
        console.log("Invalid data passed into request");
        return res.status(400).send({ message: "Invalid data passed into request" });
      }

      const isChatExist = await Chat.findOne({
        _id: new ObjectId(chatId)
      });


      if (!isChatExist) {
        console.log("Invalid chat Id");
        return res.status(400).send({ message: "Invalid chat Id" });
      }

      const newMessage = new Message({
        sender: req.body.userId || '2',
        content: content,
        chat: chatId,
      });

      let savedMessage = await newMessage.save()
      savedMessage = await savedMessage.populate("chat");

      // Retrieve sender's user data from Prisma
      const senderUserData = await prisma.user.findUnique({
        where: {
          id: savedMessage.sender,
        },
        select: {
          id: true,
          name: true,
          email: true,
          images: true,
        },
      });

      if (!senderUserData) {
        // Handle the case where senderUserData is null (sender not found)
        console.log("Sender not found");
        return res.status(404).send({ message: "Sender not found" });
      }

      // Retrieve chat users' data from Prisma
      const chatUsersData = await prisma.user.findMany({
        where: {
          id: {
            in: savedMessage.chat.users,
          },
        },
        select: {
          id: true,
          name: true,
          email: true,
          images: true,
        },
      });


      savedMessage = {
        content: savedMessage.content,
        sender: {
          id: senderUserData.id,
          name: senderUserData.name,
          email: senderUserData.email,
          images: senderUserData.images,
        },
        chat: {
          _id: isChatExist._id,
          chatName: isChatExist.chatName,
          isGroupChat: isChatExist.isGroupChat,
          users: chatUsersData.map((user) => ({
            id: user.id,
            name: user.name,
            email: user.email,
            images: user.images,
          })),
          createdAt: isChatExist.createdAt,
          updatedAt: isChatExist.updatedAt,
          __v: isChatExist.__v,
          latestMessage: isChatExist.latestMessage,
        },
        isRead: savedMessage.isRead,
        _id: savedMessage._id,
        createdAt: savedMessage.createdAt,
        updatedAt: savedMessage.updatedAt,
        __v: savedMessage.__v,
      };


      await Chat.findByIdAndUpdate(req.body.chatId, { latestMessage: savedMessage });

      res.status(200).json(savedMessage);
    } catch (error: any) {
      res.status(500).json(error.message)
      console.error('Error creating and saving chat:', error.message);
    }
  }

  //@description     Change isRead status
  //@route           PUT /api/Message/
  //@access          Protected
  static async changeIsRead(req: Request, res: Response) {
    try {
      const messageId = req.params.messageId;
      const userId = req.body.userId;

      if (!messageId || !userId) {
        console.log('Invalid data passed into request');
        return res.status(400).send({ message: 'Invalid data passed into request' });
      }

      console.log("dari controller",userId)
      // Memeriksa apakah userId berada di dalam satu chat
      const IsUserInChat = await isUserInChat(userId, messageId);

      if (!IsUserInChat) {
        console.log('User is not in the chat');
        return res.status(403).send({ message: 'User is not in the chat' });
      }

      // Update isRead to true based on messageId
      const savedMessage = await Message.findByIdAndUpdate(messageId, { isRead: true });

      res.status(200).json({message:'Update status isRead success'});
    } catch (error: any) {
      res.status(500).json(error.message)
      console.error('Error update isRead:', error.message);
    }
  }
}

// Fungsi untuk memeriksa apakah userId berada di dalam satu chat
export async function isUserInChat(userId: string, messageId: string): Promise<boolean> {
  try {
    
    const message = await Message.findById(messageId);
    if (!message) {
      throw new Error('Message not found');
    }

    const chatId = message.chat;

    console.log(chatId)
    console.log(userId)
    const isUserInChat = await Chat.exists({
      _id: new ObjectId(chatId),
      users: userId,
    });

    console.log(isUserInChat)

    return isUserInChat;
  } catch (error: any) {
    console.error('Error checking if user is in chat:', error.message);
    throw error;
  }
}

export default MessageController
