import { gql } from '@apollo/client';
import { Client } from './client';

export async function getChats(offset: number, limit: number): Promise<Chat[]> {
  const res = await Client.client.query({
    query: getQuery(),
    variables: getVariables(offset, limit),
  });

  return res.data.chats as Array<Chat>;

  function getQuery() {
    return gql`
      query GetChats($limit: Int!, $offset: Int!) {
        chats(limit: $limit, offset: $offset) {
          id
          createdAtISO
          participant {
            username
            displayName
            profilePic
          }
        }
      }
    `;
  }

  function getVariables(offset: number, limit: number) {
    return {
      offset,
      limit,
    };
  }
}

export interface Chat {
  id: string;
  createdAtISO: string;
  participant: {
    username: string;
    displayName: string;
    profilePic: string;
  };
}
