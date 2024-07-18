import { useState } from 'react';
import { Message } from '../../core/domain/message';
import { SEND_MESSAGE } from '../api/sendMessage';
import { useMutation } from '@apollo/client';
import { Client } from '../../../../utilities/client';
import { SendMessageUseCase } from '../../core/useCases/sendMessageUseCase';
import { SendMessageGateway } from '../../core/ports/sendMessageGateway';
import { SendMessageGatewayImpl } from '../gateways/sendMessageGatewayImpl';

export function useSendMessage() {
  const [error, setError] = useState('');

  const [sendMessage, { data, loading }] = useMutation<{
    sendMessage: Message;
  }>(SEND_MESSAGE, {
    onError: (error) => {
      setError('error');
    },
    client: Client.client,
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
    return await new SendMessageUseCase(buildGateway()).execute(text, chatId);
  }

  function buildGateway(): SendMessageGateway {
    return new SendMessageGatewayImpl(async (text: string, chatId: string) => {
      return (
        await sendMessage({
          variables: {
            text,
            chatId,
          },
        })
      ).data?.sendMessage as Message | null;
    });
  }
}
