import { sampleChatResponse } from '../../mocks/values';
import { Message } from '../../lib/messages/core/domain/message';
import { buildMessage } from '../generator';

const messages: Map<string, Message[]> = new Map(
  Object.entries({
    [sampleChatResponse.id]: [buildMessage(), buildMessage(), buildMessage()],
  })
);

async function create(chatId: string, message: Message) {
  if (messages.has(chatId)) messages.get(chatId)?.push(message);
  else {
    messages.set(chatId, [message]);
  }
  return message;
}

async function read(chatId: string): Promise<Message[] | undefined> {
  return messages.get(String(chatId)) || [];
}

function clear() {
  messages.clear();
}

const messagesDB = { create, read, clear };
export default messagesDB;
