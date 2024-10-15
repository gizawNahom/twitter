import { useState } from 'react';
import { Message } from '../../core/domain/message';
import { Client } from '../../../../utilities/client';
import { SendMessageUseCase } from '../../core/useCases/sendMessageUseCase';
import { SendMessageGateway } from '../../core/ports/sendMessageGateway';
import { SendMessageGatewayImpl } from '../../adapters/gateways/sendMessageGatewayImpl';
import { ApolloMessageSender } from '../../data-source-apollo/apolloMessageSender';

export function useSendMessage() {
  const [status, setStatus] = useState<'idle' | 'loading' | 'error'>('idle');
  const [message, setMessage] = useState<Message | null>();
  const senderId = 'userId1';

  return {
    handleSendMessage,
    isLoading: status == 'loading',
    message: message,
  };

  async function handleSendMessage(
    text: string,
    chatId: string
  ): Promise<Message | null | undefined> {
    try {
      setStatus('loading');
      const message = await buildUseCase().execute({ senderId, text, chatId });
      setMessage(message);
      setStatus('idle');
      return message;
    } catch (error) {
      setStatus('error');
    }
  }

  function buildUseCase() {
    return new SendMessageUseCase(buildGateway());
  }

  function buildGateway(): SendMessageGateway {
    return new SendMessageGatewayImpl(new ApolloMessageSender(Client.client));
  }
}
