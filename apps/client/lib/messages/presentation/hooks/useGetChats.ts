import { Chat } from '../../core/domain/chat';
import { useState } from 'react';
import { GetChatsUseCase } from '../../core/useCases/getChatsUseCase';
import { GetChatsGateway } from '../../core/ports/getChatsGateway';
import { GetChatsGatewayImpl } from '../../adapters/gateways/getChatsGatewayImpl';
import {
  ApolloChatsGetter,
  useApolloGetChats,
} from '../../data/apolloChatsGetter';

export function useGetChats() {
  const [error, setError] = useState('');
  const { getChats, chats, loading, fetchMore } = useApolloGetChats((error) =>
    setError('error')
  );

  return {
    handleGetChats,
    chats: chats?.chats,
    isLoading: loading,
    error,
  };

  async function handleGetChats(): Promise<Chat[] | undefined> {
    return new GetChatsUseCase(buildGateway()).execute();
  }

  function buildGateway(): GetChatsGateway {
    return new GetChatsGatewayImpl(
      new ApolloChatsGetter(getChats, fetchMore, 5)
    );
  }
}
