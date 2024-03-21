import { ApolloError, gql } from '@apollo/client';
import { Client } from '../../../../utilities/client';
import { Post } from './post';

export async function createPost(
  text: string
): Promise<[Post | null, string[] | null]> {
  try {
    return await trySendRequest(text);
  } catch (error) {
    return [null, [(error as ApolloError).message]];
  }

  async function trySendRequest(
    text: string
  ): Promise<[Post | null, string[] | null]> {
    const response = await sendRequest(text);
    return [buildPost(response), null];

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    function buildPost(response: any) {
      return {
        id: response.id,
        text: response.text,
        userId: response.userId,
        createdAt: new Date(response.createdAt),
      };
    }
  }

  async function sendRequest(text: string) {
    return (
      await Client.client.mutate({
        mutation: getMutation(),
        variables: getVariables(text),
      })
    ).data.createPost;

    function getMutation() {
      return gql`
        mutation createPost($text: String!) {
          createPost(text: $text) {
            id
            text
            userId
            createdAt
          }
        }
      `;
    }

    function getVariables(text: string) {
      return {
        text,
      };
    }
  }
}
