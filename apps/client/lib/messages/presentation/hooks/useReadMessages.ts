import { useEffect, useState } from 'react';
import { Message } from '../../core/domain/message';
import { formatDayForMessage } from '../utilities';
import { ReadMessagesUseCase } from '../../core/useCases/readMessagesUseCase';
import { ReadMessagesGatewayImpl } from '../../adapters/gateways/readMessagesGatewayImpl';
import { ApolloMessagesReader } from '../../data-source-apollo/apolloMessagesReader';
import { ReadMessagesGateway } from '../../core/ports/readMessagesGateway';
import { Client } from '../../../../utilities/client';
import {
  ApolloMessageStore,
  MessageStore,
} from '../../data-source-apollo/apolloMessageStore';

export type MessagesByDay = Map<string, Message[]>;

export function useReadMessages(chatId: string | undefined) {
  const { messages, subscribe } = useSubscribeToMessages(
    new ApolloMessageStore(Client.client)
  );

  useEffect(() => {
    (async () => {
      if (chatId) {
        try {
          subscribe(chatId);
          await handleReadMessages(chatId);
        } catch (error) {
          //
        }
      }
    })();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [chatId]);

  return {
    messagesByDay: buildMessagesByDay(messages || []),
  };

  async function handleReadMessages(chatId: string) {
    await buildUseCase().execute(chatId);
  }

  function buildUseCase() {
    return new ReadMessagesUseCase(buildGateway());

    function buildGateway(): ReadMessagesGateway {
      return new ReadMessagesGatewayImpl(new ApolloMessagesReader());
    }
  }

  function buildMessagesByDay(messages: Message[]) {
    const prevMsgs: MessagesByDay = new Map();
    messages.forEach((m) => {
      addMessage(m, prevMsgs);
    });
    return prevMsgs;

    function addMessage(msg: Message, prevMsgs: MessagesByDay) {
      const day = formatDayForMessage(new Date(msg.createdAt));
      if (prevMsgs.has(day)) prevMsgs.get(day)?.push(msg);
      else prevMsgs.set(day, [msg]);
    }
  }
}

function useSubscribeToMessages(messageStore: MessageStore) {
  const [messages, setMessages] = useState<Message[] | undefined>();
  const [chatId, setChatId] = useState<string | undefined>();

  useEffect(() => {
    if (chatId) {
      messageStore.messagesUpdated.add(setMessages, chatId);
    }

    return () => {
      messageStore.messagesUpdated.remove(setMessages, chatId as string);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [chatId]);

  return { messages, subscribe };

  function subscribe(chatId: string) {
    setChatId(chatId);
  }
}
