import { gql } from '@apollo/client';
import { Client, EndOfListError } from '../../../../utilities/client';
import { Chat } from '../../core/domain/chat';

export async function getChats(offset: number, limit: number): Promise<Chat[]> {
  try {
    const res = await Client.client.query({
      query: getQuery(),
      variables: getVariables(offset, limit),
      fetchPolicy: 'network-only',
    });

    return res.data.chats as Array<Chat>;
  } catch (error) {
    if (error instanceof EndOfListError) throw error;
    throw new Error();
  }

  function getQuery() {
    return GET_CHATS;
  }

  function getVariables(offset: number, limit: number) {
    return {
      offset,
      limit,
    };
  }
}

export const GET_CHATS = gql`
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
