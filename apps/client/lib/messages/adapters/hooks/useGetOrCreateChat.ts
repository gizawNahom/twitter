import { ApolloClient, useMutation } from '@apollo/client';
import { GET_OR_CREATE_CHAT } from '../api/getOrCreateChat';
import { PartialChat } from '../../core/domain/partialChat';
import { useState } from 'react';
import { Client } from '../../../../utilities/client';
import { GetOrCreateChatUseCase } from '../../core/useCases/getOrCreateChatUseCase';
import { GetOrCreateChatDataSource } from '../../core/ports/getOrCreateChatDataSource';

export function useGetOrCreateChat() {
  const [error, setError] = useState('');

  const [getOrCreateChat, { data: chat, loading }] = useMutation<{
    chat: PartialChat;
  }>(GET_OR_CREATE_CHAT, {
    onError: (error) => {
      setError('error');
    },
    client: Client.client as ApolloClient<object>,
  });

  const handleGetOrCreateChat = async (
    username: string
  ): Promise<PartialChat | null | undefined> => {
    const dataSource: GetOrCreateChatDataSource = {
      async getOrCreateChat(username): Promise<PartialChat | null> {
        return (
          await getOrCreateChat({
            variables: {
              username,
            },
          })
        ).data?.chat as PartialChat | null;
      },
    };
    return new GetOrCreateChatUseCase(dataSource).execute(username);
  };

  return {
    handleGetOrCreateChat,
    isLoading: loading,
    chat: chat?.chat,
    error,
  };
}
