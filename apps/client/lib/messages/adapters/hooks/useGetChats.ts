import { useLazyQuery } from '@apollo/client';
import { GET_CHATS } from '../api/getChats';
import { Chat } from '../../core/domain/chat';
import { Client } from '../../../../utilities/client';

export function useGetChats() {
  const [getChats, { data: chats }] = useLazyQuery<{
    chats: Chat[];
  }>(GET_CHATS, {
    client: Client.client,
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
  };
}
