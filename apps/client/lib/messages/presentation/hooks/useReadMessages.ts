import { useEffect, useRef, useState } from 'react';
import { Message } from '../../core/domain/message';
import { formatDayForMessage } from '../utilities';
import { ReadMessagesUseCase } from '../../core/useCases/readMessagesUseCase';
import { ReadMessagesImpl } from '../../adapters/gateways/readMessagesImpl';
import { ApolloMessagesReader } from '../../data/apolloMessagesReader';
import { ReadMessagesGateway } from '../../core/ports/readMessagesGateway';
import { gql, ObservableQuery } from '@apollo/client';
import { Client } from '../../../../utilities/client';

export type MessagesByDay = Map<string, Message[]>;

const READ_MESSAGES = gql`
  query ReadMessages($chatId: ID) {
    messages(chatId: $chatId) {
      id
      senderId
      chatId
      text
      createdAt
      isLoading @client
    }
  }
`;

export function useReadMessages(chatId: string | undefined) {
  const [messagesByDay, setMessagesByDay] = useState<MessagesByDay>(new Map());
  const observable = useRef<ObservableQuery<any, { chatId: string }>>();

  useEffect(() => {
    if (chatId) {
      observable.current = Client.client.watchQuery({
        query: READ_MESSAGES,
        variables: {
          chatId: chatId,
        },
        fetchPolicy: 'cache-only',
      });

      observable.current?.subscribe({
        next({ data: { messages } }) {
          setMessagesByDay(buildMessagesByDay(messages || []));
        },
        error(errorValue) {
          //
        },
      });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [chatId]);

  return {
    handleReadMessages,
    messagesByDay,
  };

  async function handleReadMessages(chatId: string) {
    await buildUseCase().execute(chatId);
  }

  function buildUseCase() {
    return new ReadMessagesUseCase(buildGateway());
  }

  function buildGateway(): ReadMessagesGateway {
    return new ReadMessagesImpl(new ApolloMessagesReader());
  }

  function buildMessagesByDay(messages: Message[]) {
    const prevMsgs: MessagesByDay = new Map();
    messages.forEach((m) => {
      addMessage(m, prevMsgs);
    });
    return prevMsgs;
  }

  function addMessage(msg: Message, prevMsgs: MessagesByDay) {
    const day = formatDayForMessage(new Date(msg.createdAt));
    if (prevMsgs.has(day)) prevMsgs.get(day)?.push(msg);
    else prevMsgs.set(day, [msg]);
  }
}
