import { sampleChatResponse } from '../../mocks/values';
import { Message } from '../../lib/messages/core/domain/message';
import { buildMessage } from '../generator';

const messages: Map<string, Message[]> = new Map(
  Object.entries({
    [sampleChatResponse.id]: [buildMessage(), buildMessage(), buildMessage()],
  })
);

function create(chatId: string, message: Message): Promise<Message>;
function create(chatId: string, text: string): Promise<Message>;

async function create(chatId: string, param: Message | string) {
  return createMessage(chatId, getMessage(param));

  function getMessage(param: Message | string): Message {
    if (typeof param === 'string') {
      return buildMessage({
        text: param,
        createdAt: new Date().toISOString(),
      });
    }
    return param;
  }

  async function createMessage(chatId: string, message: Message) {
    if (messages.has(chatId)) messages.get(chatId)?.push(message);
    else {
      messages.set(chatId, [message]);
    }
    return message;
  }
}

async function read(chatId: string): Promise<Message[] | undefined> {
  return messages.get(String(chatId)) || [];
}

function clear() {
  messages.clear();
}

const messagesDB = { read, clear, create };
export default messagesDB;
