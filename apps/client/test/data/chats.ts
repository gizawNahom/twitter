import { Chat } from '../../lib/messages/core/domain/chat';

const chats: Chat[] = [];

async function create(chat: Chat) {
  chats.push(chat);
  return chat;
}

async function read(offset: number, limit: number): Promise<Chat[]> {
  return chats.slice(offset, offset + limit);
}

const chatsDB = { create, read };
export default chatsDB;
