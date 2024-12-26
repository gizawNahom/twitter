import { useMutation } from '@apollo/client';
import { GET_OR_CREATE_CHAT } from '../../adapters/api/getOrCreateChat';
import { useState } from 'react';
import { Client } from '../../../../utilities/client';
import { GetOrCreateChatUseCase } from '../../core/useCases/getOrCreateChatUseCase';
import { GetOrCreateChatGateway } from '../../core/ports/getOrCreateChatGateway';
import { GetOrCreateChatGatewayImpl } from '../../adapters/gateways/getOrCreateChatGatewayImpl';
import { Chat } from '../../core/domain/chat';

export function useGetOrCreateChat() {
  const [error, setError] = useState('');

  const [getOrCreateChat, { data: chat, loading }] = useMutation<{
    chat: Chat;
  }>(GET_OR_CREATE_CHAT, {
    onError: (error) => {
      setError('error');
    },
    client: Client.client,
  });

  return {
    handleGetOrCreateChat,
    isLoading: loading,
    chat: chat?.chat,
    error,
  };

  async function handleGetOrCreateChat(username: string) {
    return await new GetOrCreateChatUseCase(buildGateway()).execute(username);
  }

  function buildGateway(): GetOrCreateChatGateway {
    return new GetOrCreateChatGatewayImpl(async (username: string) => {
      return (
        await getOrCreateChat({
          variables: {
            username,
          },
        })
      ).data?.chat as Chat | null;
    });
  }
}
