import { gql } from '@apollo/client';
import { Client } from './client';

export async function getOrCreateChat(username: string): Promise<Chat> {
  try {
    const res = await Client.client.mutate({
      mutation: getMutation(),
      variables: getVariables(username),
    });

    return res.data.chat as Chat;
  } catch (error) {
    throw new Error();
  }

  function getMutation() {
    return gql`
      mutation GetOrCreateChat($username: String!) {
        chat(username: $username) {
          id
          createdAt
        }
      }
    `;
  }

  function getVariables(username: string) {
    return {
      username,
    };
  }
}

export interface Chat {
  id: string;
  createdAt: string;
}
