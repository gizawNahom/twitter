import { Chat } from '../../lib/messages/core/domain/chat';
import { buildChat } from '../generator';

const chats: Chat[] = [
  buildChat(),
  buildChat(),
  buildChat(),
  buildChat(),
  buildChat(),
  buildChat(),
];

async function create(chat: Chat) {
  chats.push(chat);
  return chat;
}

async function read(offset: number, limit: number): Promise<Chat[]> {
  const start = offset * limit;
  return chats.slice(start, start + limit);
}

function clear() {
  chats.splice(0, chats.length);
}

const chatsDB = { create, read, clear };
export default chatsDB;
