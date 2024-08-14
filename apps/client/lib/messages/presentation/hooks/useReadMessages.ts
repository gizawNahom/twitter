import { useState } from 'react';
import { Message } from '../../core/domain/message';
import { formatDayForMessage } from '../utilities';
import { ReadMessagesUseCase } from '../../core/useCases/readMessagesUseCase';
import { ReadMessagesImpl } from '../../adapters/gateways/readMessagesImpl';
import { ApolloMessagesReader } from '../../data/apolloMessagesReader';
import { ReadMessagesGateway } from '../../core/ports/readMessagesGateway';

type MessagesType = Map<string, { isToBeSent: boolean; message: Message }[]>;

export function useReadMessages() {
  const [messages, setMessages] = useState<MessagesType>(new Map());

  return {
    handleReadMessages,
    messages,
    setMessages,
  };

  async function handleReadMessages(chatId: string): Promise<Message[]> {
    const messages = await buildUseCase().execute(chatId);
    setMessages(buildMessages(messages));
    return messages;
  }

  function buildUseCase() {
    return new ReadMessagesUseCase(buildGateway());
  }

  function buildGateway(): ReadMessagesGateway {
    return new ReadMessagesImpl(new ApolloMessagesReader());
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
