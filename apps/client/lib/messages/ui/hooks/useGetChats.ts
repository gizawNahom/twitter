import { Chat } from '../../core/domain/chat';
import { useState } from 'react';
import { GetChatsUseCase } from '../../core/useCases/getChatsUseCase';
import { GetChatsGateway } from '../../core/ports/getChatsGateway';
import { GetChatsGatewayImpl } from '../../adapters/gateways/getChatsGatewayImpl';
import { EndOfListError } from '../../../../utilities/client';
import { ApolloChatsGetter } from '../../data-source-apollo/apolloChatsGetter';

export function useGetChats() {
  const [status, setStatus] = useState<
    'loading' | 'idle' | 'finished' | 'error'
  >('idle');
  const [chats, setChats] = useState<Chat[]>([]);

  return {
    handleGetChats,
    chats,
    isLoading: status == 'loading',
    isFinished: status == 'finished',
    isError: status == 'error',
  };

  async function handleGetChats(offset: number) {
    try {
      setStatus('loading');
      setChats((await buildUseCase().execute(offset)) as Chat[]);
      setStatus('idle');
    } catch (error) {
      if (error instanceof EndOfListError) setStatus('finished');
      else setStatus('error');
    }
  }

  function buildUseCase() {
    return new GetChatsUseCase(buildGateway());

    function buildGateway(): GetChatsGateway {
      return new GetChatsGatewayImpl(new ApolloChatsGetter());
    }
  }
}
