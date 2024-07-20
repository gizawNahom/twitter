import { Chat } from '../../lib/messages/core/domain/chat';

const chats: Chat[] = [];

async function create(chat: Chat) {
  chats.push(chat);
  return chat;
}

async function read(chatId: string) {
  return chats.find((chat) => chat.id === chatId);
}

const chatsDB = { create, read };
export default chatsDB;
