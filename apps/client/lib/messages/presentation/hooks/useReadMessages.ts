import { useState } from 'react';
import { Message } from '../../core/domain/message';
import { readMessages } from '../../adapters/api/readMessages';
import { formatDayForMessage } from '../utilities';
import { ReadMessagesUseCase } from '../../core/useCases/readMessagesUseCase';

type MessagesType = Map<string, { isToBeSent: boolean; message: Message }[]>;

export function useReadMessages() {
  const [messages, setMessages] = useState<MessagesType>(new Map());

  return {
    handleReadMessages,
    messages,
    setMessages,
  };

  async function handleReadMessages(chatId: string): Promise<Message[]> {
    const messages = await new ReadMessagesUseCase({
      async readMessages(chatId: string) {
        return readMessages(chatId as string, 0, 3);
      },
    }).execute(chatId);
    setMessages(buildMessages(messages));
    return messages;
  }

  function buildMessages(messages: Message[]) {
    const prevMsgs: MessagesType = new Map();
    messages.forEach((m) => {
      addMessage(m, prevMsgs);
    });
    return prevMsgs;
  }

  function addMessage(m: Message, prevMsgs: MessagesType, isToBeSent = false) {
    const day = formatDayForMessage(new Date(m.createdAt));
    if (prevMsgs.has(day)) prevMsgs.get(day)?.push({ isToBeSent, message: m });
    else prevMsgs.set(day, [{ isToBeSent, message: m }]);
  }
}
