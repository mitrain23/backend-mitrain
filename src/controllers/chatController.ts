import { Request, Response } from 'express'
import { Chat, usersExist } from '../mongoose/models';
import prisma from '../utils/prisma'
import { User } from '@prisma/client';
var ObjectId = require('mongoose').Types.ObjectId; 

class ChatController {

	//@description     Create or fetch One to One Chat
	//@route           POST /api/chat/
	//@access          Protected
	static async accessChat(req: Request, res: Response) {
		try {
			const { product_id } = req.body;

			const userId = "9dbb0a85-47ca-4ca3-9dc6-880dd7b7bf6e"

			// if (!userId) {
			// 	console.log("UserId param not sent with request");
			// 	return res
			// 		.status(400)
			// 		.send("UserId param not sent with request");
			// }
			// await usersExist([userId]);
			const post = await prisma.post.findUnique({
				where: {
				  id: product_id
				}
			  })
			  if (!post) {
				throw new Error('Cannot find post (product id)')
			  }

			const isChat = await Chat.find({
				users: { $in: [req.body.userId] },
				product_Id: { $eq: post.id }
			  })
			  .populate('latestMessage')
			  .exec();

			if (isChat.length > 0) {
				const responseData = await processChatData(isChat, prisma);
				res.status(200).json({ data: responseData[0] });
			} else {
				const newChat = new Chat({
					chatName: "sender",
					isGroupChat: false,
					users: [req.body.userId, userId],
					product_Id: post.id,
					product_name: post.title
				});

				const savedChat = await newChat.save();

				let arraySavedChat = [savedChat];

				const responseData = await processChatData(arraySavedChat, prisma);
				res.status(201).json({ data: responseData[0] });
			}

		} catch (error: any) {
			res.status(500).json({ error: error.message });
		}
	}

	//@description     Fetch all chats for a user
	//@route           GET /api/chat/
	//@access          Protected
	static async fetchChats(req: Request, res: Response) {
		try {
			const result = await Chat.find({ users: { $elemMatch: { $eq: req.body.userId } } })
				.populate("latestMessage")
				.sort({ updatedAt: -1 })


			const responseData = await processChatData(result, prisma);

			res.status(200).send(responseData);
		} catch (error: any) {
			res.status(400);
			throw new Error(error.message)
		}
	}

}

export async function processChatData(chats: any[], prisma: any): Promise<any[]> {
	const allUserIds = chats.reduce((userIds: string[], chat: { users: any }) => {
		return userIds.concat(chat.users);
	}, []);

	console.log('tes');
	const uniqueUserIds = Array.from(new Set(allUserIds)) as string[];

	const usersData = await prisma.user.findMany({
		where: {
			id: {
				in: uniqueUserIds,
			},
		},
		select: {
			id: true,
			name: true,
			email: true,
			images: true,
		},
	});

	return Promise.all(
    chats.map(async (chat: typeof Chat) => {
      const latestMessageData = chat.latestMessage || null;

      // Fetch additional user data for the sender of the latest message
      const senderUserData = latestMessageData
        ? await prisma.user.findUnique({
            where: {
              id: latestMessageData.sender,
            },
            select: {
              id: true,
              name: true,
              email: true,
              images: true,
            },
          })
        : null;

      return {
        _id: chat._id,
        chatName: chat.chatName,
		product_Id: chat.product_Id,
		product_name: chat.product_name,
        isGroupChat: chat.isGroupChat,
        users: usersData
          .filter((user: User) => chat.users.includes(user.id))
          .map((user: { id: User; name: User; email: User; images: any; }) => ({
            id: user.id,
            name: user.name,
            email: user.email,
            images: user.images,
          })),
        groupAdmin: chat.groupAdmin,
        createdAt: chat.createdAt,
        updatedAt: chat.updatedAt,
        __v: chat.__v,
        latestMessage: latestMessageData && {
          _id: latestMessageData._id,
          content: latestMessageData.content,
          sender: senderUserData || latestMessageData.sender, // Use senderUserData if available
          chat: latestMessageData.chat,
          isRead: latestMessageData.isRead,
          createdAt: latestMessageData.createdAt,
          updatedAt: latestMessageData.updatedAt,
          __v: latestMessageData.__v,
        },
      };
    })
  );
}

export default ChatController
