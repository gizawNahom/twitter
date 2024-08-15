import { useState } from 'react';
import { Message } from '../../core/domain/message';
import { SEND_MESSAGE } from '../api/sendMessage';
import { gql, useMutation } from '@apollo/client';
import { Client } from '../../../../utilities/client';
import { SendMessageUseCase } from '../../core/useCases/sendMessageUseCase';
import { SendMessageGateway } from '../../core/ports/sendMessageGateway';
import { SendMessageGatewayImpl } from '../gateways/sendMessageGatewayImpl';
import { ApolloMessageSender } from '../../data/apolloMessageSender';

export function useSendMessage() {
  const [error, setError] = useState('');
  const [status, setStatus] = useState<'idle' | 'loading' | 'error'>('idle');
  const [message, setMessage] = useState<Message | null>();

  const [sendMessage, { data }] = useMutation<{
    sendMessage: Message;
  }>(SEND_MESSAGE, {
    onError: (error) => {
      setError('error');
    },
    client: Client.client,
    update(cache, { data }) {
      console.log(`

        Before modification`);
      console.log(cache.extract());

      const message = data?.sendMessage;

      console.log(`
        MESSAGE
        `);
      console.log(message);
      cache.writeQuery({
        query: gql`
          query ReadMessages($chatId: ID) {
            messages(chatId: $chatId) {
              id
              senderId
              chatId
              text
              createdAt
            }
          }
        `,
        variables: {
          chatId: message?.chatId,
        },
        data: {
          messages: [message],
        },
      });

      console.log(`

        After modification`);
      console.log(cache.extract());
    },
  });

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
      const message = await buildUseCase().execute(text, chatId);
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
    return new SendMessageGatewayImpl(new ApolloMessageSender());
  }
}
