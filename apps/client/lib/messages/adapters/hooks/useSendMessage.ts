import { useState } from 'react';
import { Message } from '../../core/domain/message';
import { SEND_MESSAGE } from '../api/sendMessage';
import { ApolloClient, useMutation } from '@apollo/client';
import { Client } from '../../../../utilities/client';
import { SendMessageUseCase } from '../../core/useCases/sendMessageUseCase';
import { SendMessageDataSource } from '../../core/ports/sendMessageDataSource';

export function useSendMessage() {
  const [error, setError] = useState('');

  const [sendMessage, { data, loading }] = useMutation<{
    sendMessage: Message;
  }>(SEND_MESSAGE, {
    onError: (error) => {
      setError('error');
    },
    client: Client.client as ApolloClient<object>,
  });

  return {
    handleSendMessage,
    isLoading: loading,
    message: data?.sendMessage,
    error,
  };

  async function handleSendMessage(
    text: string,
    chatId: string
  ): Promise<Message | null | undefined> {
    return await new SendMessageUseCase(createSendMessageDataSource()).execute(
      text,
      chatId
    );
  }

  function createSendMessageDataSource(): SendMessageDataSource {
    return {
      async sendMessage(text, chatId): Promise<Message | null> {
        return (
          await sendMessage({
            variables: {
              text,
              chatId,
            },
          })
        ).data?.sendMessage as Message | null;
      },
    };
  }
}
