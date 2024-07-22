import { useLazyQuery } from '@apollo/client';
import { GET_CHATS } from '../api/getChats';
import { Chat } from '../../core/domain/chat';
import { Client } from '../../../../utilities/client';
import { useState } from 'react';

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
    handleGetChats: async (): Promise<Chat[] | undefined> => {
      return (
        await getChats({
          variables: {
            offset: 0,
            limit: 3,
          },
        })
      ).data?.chats;
    },
    chats: chats?.chats,
    isLoading: loading,
    error,
  };
}
