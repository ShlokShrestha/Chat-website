import { Request, Response } from "express";
import prisma from "../db/prisma";
import { getReceiverSocketId, io } from "../socket/socket";

export const sendMessage = async (req: Request, res: Response) => {
  try {
    const { message } = req.body;
    const { id: receiverId } = req.params;
    const senderId = req.user.id;
    let conservation = await prisma.conversation.findFirst({
      where: {
        participantsIds: {
          hasEvery: [senderId, receiverId],
        },
      },
    });
    if (!conservation) {
      conservation = await prisma.conversation.create({
        data: {
          participantsIds: {
            set: [senderId, receiverId],
          },
        },
      });
    }
    const newMessage = await prisma.message.create({
      data: {
        senderId,
        body: message,
        conversationId: conservation.id,
      },
    });
    if (newMessage) {
      conservation = await prisma.conversation.update({
        where: {
          id: conservation.id,
        },
        data: {
          messages: {
            connect: {
              id: newMessage.id,
            },
          },
        },
      });
    }
    const receiverSocketId = getReceiverSocketId(receiverId);
    if (receiverSocketId) {
      io.to(receiverSocketId).emit("newMessage", newMessage);
    }
    res.status(201).json(newMessage);
  } catch (error: any) {
    console.log("Error", error.message);
    res.status(500).json({ error: "Internal server error" });
  }
};

export const getMessages = async (
  req: Request,
  res: Response
): Promise<any> => {
  try {
    const { id: userToChartId } = req.params;
    const senderId = req.user.id;
    let conservation = await prisma.conversation.findFirst({
      where: {
        participantsIds: {
          hasEvery: [senderId, userToChartId],
        },
      },
      include: {
        messages: {
          orderBy: {
            createdAt: "asc",
          },
        },
      },
    });
    if (!conservation) {
      return res.status(200).json([]);
    }
    res.status(200).json(conservation.messages);
  } catch (error: any) {
    console.log("Error", error.message);
    res.status(500).json({ error: "Internal server error" });
  }
};

export const getUsersForSidebar = async (req: Request, res: Response) => {
  try {
    const authUser = req.user.id;
    const user = await prisma.user.findMany({
      where: {
        id: {
          not: authUser,
        },
      },
      select: {
        id: true,
        fullName: true,
        profilePic: true,
      },
    });
    res.status(200).json(user);
  } catch (error: any) {
    console.log("Error", error.message);
    res.status(500).json({ error: "Internal server error" });
  }
};
