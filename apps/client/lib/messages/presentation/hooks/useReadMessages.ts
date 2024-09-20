import { useEffect, useRef, useState } from 'react';
import { Message } from '../../core/domain/message';
import { formatDayForMessage } from '../utilities';
import { ReadMessagesUseCase } from '../../core/useCases/readMessagesUseCase';
import { ReadMessagesGatewayImpl } from '../../adapters/gateways/readMessagesGatewayImpl';
import { ApolloMessagesReader } from '../../data-source-apollo/apolloMessagesReader';
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
  useSubscribeToMessages(chatId, (messages) => {
    setMessagesByDay(buildMessagesByDay(messages || []));
  });

  useEffect(() => {
    (async () => {
      if (chatId) {
        try {
          await handleReadMessages(chatId);
        } catch (error) {
          //
        }
      }
    })();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [chatId]);

  return {
    messagesByDay,
  };

  async function handleReadMessages(chatId: string) {
    await buildUseCase().execute(chatId);
  }

  function buildUseCase() {
    return new ReadMessagesUseCase(buildGateway());
  }

  function buildGateway(): ReadMessagesGateway {
    return new ReadMessagesGatewayImpl(new ApolloMessagesReader());
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

function useSubscribeToMessages(
  chatId: string | undefined,
  onMessages: (messages: Message[]) => void
) {
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
          onMessages(messages);
        },
        error(_errorValue) {
          //
        },
      });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [chatId]);
}
