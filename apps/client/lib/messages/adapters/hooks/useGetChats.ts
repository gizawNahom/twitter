import { useLazyQuery } from '@apollo/client';
import { GET_CHATS } from '../api/getChats';
import { Chat } from '../../core/domain/chat';
import { Client } from '../../../../utilities/client';
import { useState } from 'react';
import { GetChatsUseCase } from '../../core/useCases/getChatsUseCase';
import { GetChatsGateway } from '../../core/ports/getChatsGateway';
import { GetChatsGatewayImpl } from '../gateways/getChatsGatewayImpl';

export function useGetChats() {
  const [error, setError] = useState('');
  const [getChats, { data: chats, loading }] = useLazyQuery<{
    chats: Chat[];
  }>(GET_CHATS, {
    client: Client.client,
    onError(error) {
      setError('error');
    },
  });

  return {
    handleGetChats,
    chats: chats?.chats,
    isLoading: loading,
    error,
  };

  async function handleGetChats() {
    return new GetChatsUseCase(buildGateway()).execute(0, 3);
  }

  function buildGateway(): GetChatsGateway {
    return new GetChatsGatewayImpl(async (offset: number, limit: number) => {
      return (
        await getChats({
          variables: {
            offset,
            limit,
          },
        })
      ).data?.chats as Chat[];
    });
  }
}
