"use server";

import { MessageSchema, messageSchema } from "@/lib/schemas/messageSchema";
import { ActionResult } from "@/types";
import { getAuthUserId } from "./authActions";
import { prisma } from "@/lib/prisma";
import { Message } from "@prisma/client";
import { mapMessageToMessageDto } from "@/lib/mappings";
export async function createMessage(
  recipientUserId: string,
  data: MessageSchema
): Promise<ActionResult<Message>> {
  try {
    const userId = await getAuthUserId();

    const validated = messageSchema.safeParse(data);

    if (!validated.success)
      return { status: "error", error: validated.error.errors };

    const { text } = validated.data;

    const message = await prisma.message.create({
      data: {
        text,
        recipientId: recipientUserId,
        senderId: userId,
      },
    });

    return { status: "success", data: message };
  } catch (error) {
    console.log(error);
    return { status: "error", error: "出了点问题" };
  }
}
export async function getMessageThread(recipientId: string) {
  try {
    const userId = await getAuthUserId();

    const messages = await prisma.message.findMany({
      where: {
        OR: [
          {
            senderId: userId,
            recipientId,
          },
          {
            senderId: recipientId,
            recipientId: userId,
          },
        ],
      },
      orderBy: {
        created: "asc",
      },
      select: {
        id:true,
        text:true,
        created:true,
        dateRead:true,
        sender:{
            select: {
                userId:true,
                name:true,
                image:true
            }
        },
        recipient:{
            select: {
                userId:true,
                name:true,
                image:true
            }
        }
      }
    });
    return messages.map(message =>mapMessageToMessageDto(message))
} catch (error) {
    console.log(error);
    throw error;
  }
}

export async function getMessagesByContainer(container:string) {
  try {
    const userId = await getAuthUserId();
    const selector = container === 'outbox' ? 'senderId':'recipientId'
    const messages = await prisma.message.findMany({
      where:{
        [selector]: userId
      },
      orderBy: {
        created: "desc",
      },
      select:{
        id:true,
        text:true,
        created:true,
        dateRead:true,
        sender:{
            select: {
                userId:true,
                name:true,
                image:true
            }
        },
        recipient:{
            select: {
                userId:true,
                name:true,
                image:true
            }
        }
      }
    })
    return messages.map(message => mapMessageToMessageDto(message))
  } catch (error) {
    console.log(error)
    throw(error)
  }
}