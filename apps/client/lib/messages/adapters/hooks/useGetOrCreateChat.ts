import { useMutation } from '@apollo/client';
import { GET_OR_CREATE_CHAT } from '../api/getOrCreateChat';
import { PartialChat } from '../../core/domain/partialChat';
import { useState } from 'react';
import { Client } from '../../../../utilities/client';
import { GetOrCreateChatUseCase } from '../../core/useCases/getOrCreateChatUseCase';
import { GetOrCreateChatGateway } from '../../core/ports/getOrCreateChatGateway';
import { GetOrCreateChatGatewayImpl } from '../gateways/getOrCreateChatGatewayImpl';

export function useGetOrCreateChat() {
  const [error, setError] = useState('');

  const [getOrCreateChat, { data: chat, loading }] = useMutation<{
    chat: PartialChat;
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
    return new GetOrCreateChatUseCase(buildGateway()).execute(username);
  }

  function buildGateway(): GetOrCreateChatGateway {
    return new GetOrCreateChatGatewayImpl(async (username: string) => {
      return (
        await getOrCreateChat({
          variables: {
            username,
          },
        })
      ).data?.chat as PartialChat | null;
    });
  }
}
