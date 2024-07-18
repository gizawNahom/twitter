import { ApolloClient, useMutation } from '@apollo/client';
import { GET_OR_CREATE_CHAT } from '../api/getOrCreateChat';
import { PartialChat } from '../../core/domain/partialChat';
import { useState } from 'react';
import { Client } from '../../../../utilities/client';

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
    return (
      await getOrCreateChat({
        variables: {
          username,
        },
      })
    ).data?.chat;
  };

  return {
    handleGetOrCreateChat,
    isLoading: loading,
    chat: chat?.chat,
    error,
  };
}
