import { gql } from '@apollo/client';
import { Client } from '../../../../utilities/client';
import { PartialChat } from '../../core/domain/partialChat';

export async function getOrCreateChat(username: string): Promise<PartialChat> {
  try {
    const res = await Client.client.mutate({
      mutation: getMutation(),
      variables: getVariables(username),
    });

    return res.data.chat as PartialChat;
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
