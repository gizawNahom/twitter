import { useState } from 'react';
import { Message } from '../../core/domain/message';
import { SEND_MESSAGE } from '../api/sendMessage';
import { ApolloClient, useMutation } from '@apollo/client';
import { Client } from '../../../../utilities/client';

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

  const handleSendMessage = async (
    text: string,
    chatId: string
  ): Promise<Message | null | undefined> => {
    return (
      await sendMessage({
        variables: {
          text,
          chatId,
        },
      })
    ).data?.sendMessage;
  };

  return {
    handleSendMessage,
    isLoading: loading,
    message: data?.sendMessage,
    error,
  };
}
