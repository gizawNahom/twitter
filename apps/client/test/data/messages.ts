import { sampleChatResponse } from '../../mocks/values';
import { Message } from '../../lib/messages/core/domain/message';
import { buildMessage } from '../generator';

function repeatFunction<T>(func: () => T, times: number): T[] {
  const results: T[] = [];
  for (let i = 0; i < times; i++) {
    results.push(func());
  }
  return results;
}

const messages: Map<string, Message[]> = new Map(
  Object.entries({
    [sampleChatResponse.id]: repeatFunction<Message>(buildMessage, 10),
  })
);

function create(chatId: string, message: Message): Promise<Message>;
function create(chatId: string, text: string): Promise<Message>;
function create(
  chatId: string,
  text: string,
  senderId: string
): Promise<Message>;

async function create(
  chatId: string,
  param: Message | string,
  senderId?: string
) {
  return createMessage(chatId, getMessage(param, chatId));

  function getMessage(param: Message | string, chatId: string): Message {
    if (typeof param === 'string') {
      return buildMessage({
        text: param,
        createdAt: new Date().toISOString(),
        chatId,
        senderId,
      });
    }
    param.chatId = chatId;
    return param;
  }

  async function createMessage(chatId: string, message: Message) {
    if (chatId) {
      if (messages.has(chatId)) messages.get(chatId)?.push(message);
      else {
        messages.set(chatId, [message]);
      }
    }
    return message;
  }
}

async function read(
  offset: number,
  limit: number,
  chatId: string
): Promise<Message[] | undefined> {
  const messagesInChat = messages.get(String(chatId)) || [];
  const page = offset * limit;
  return messagesInChat.slice(page, page + limit);
}

function clear() {
  messages.clear();
}

const messagesDB = { clear, create, read };
export default messagesDB;
