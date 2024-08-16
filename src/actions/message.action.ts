"use server";

import { redis } from "@/lib/db";
import { getKindeServerSession } from "@kinde-oss/kinde-auth-nextjs/server";
import { pusherServer } from "../lib/pusher";

type SendMessageActionArgs = {
  content: string;
  messageType: "image" | "text";
  receiverId: string;
};
interface Message {
  id: number;
  senderId: string;
  content: string;
  messageType: "text" | "image";
}

export const sendMessageAction = async ({
  content,
  messageType,
  receiverId,
}: SendMessageActionArgs) => {
  const { getUser } = getKindeServerSession();

  const user = await getUser();

  if (!user) {
    return { success: false, message: "User not authorized" };
  }

  const senderId = user.id;

  //example of how to create a new message
  // jone id is 123 and jane id is 456
  //conversation id will be 123:456
  const conversationId = `conversation:${[senderId, receiverId]
    .sort()
    .join(":")}`;

  // TODO: check if conversation exists
  const conversationExists = await redis.exists(conversationId);

  if (!conversationExists) {
    await redis.hset(conversationId, {
      participant1: senderId,
      participant2: receiverId,
    });

    await redis.sadd(`user:${senderId}:conversations`, conversationId);
    await redis.sadd(`user:${receiverId}:conversations`, conversationId);
  }

  // TODO: Generate a unique message id
  const messageId = `message:${Date.now()}:${Math.random()
    .toString(36)
    .substring(2, 9)}`;

  //* create a timestamp
  const timestamp = Date.now();

  // TODO: Save the message in redis
  await redis.hset(messageId, {
    senderId,
    content,
    timestamp,
    messageType,
  });

  // TODO : Adding message sort functionality

  await redis.zadd(`${conversationId}:messages`, {
    score: timestamp,
    member: JSON.stringify(messageId),
  });

  // TODO: Trigger a pusher event
  const channelName = `${senderId}__${receiverId}`
    .split("__")
    .sort()
    .join("__");

  //^trigger a pusher event
  await pusherServer?.trigger(channelName, "newMessage", {
    message: { senderId, content, timestamp, messageType },
  });

  //^return a success message
  return { success: true, conversationId, messageId };
};

export const getMessagesAction = async (
  selectedUserId: string,
  currentUserId: string
) => {
  // get conversation id
  const conversationId = `conversation:${[selectedUserId, currentUserId]
    .sort()
    .join(":")}`;

  // get message ids
  const messageIds = await redis.zrange(`${conversationId}:messages`, 0, -1);

  // if messageIds is empty return an empty array
  if (messageIds.length === 0) return [];

  const pipeline = redis.pipeline();

  messageIds.forEach((messageId) => pipeline.hgetall(messageId as string));

  const messages = (await pipeline.exec()) as Message[];

  return messages;
};
