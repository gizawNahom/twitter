import { gql } from '@apollo/client';
import { Post } from './post';
import { Client } from '../../../../utilities/client';

export async function fetchPosts(
  userId: string,
  offset: number,
  limit: number
): Promise<Array<Post>> {
  try {
    const res = await Client.client.query({
      query: getQuery(),
      variables: getVariables(userId, offset, limit),
    });

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    return res.data.posts.map((post: any) => {
      return {
        id: post.id,
        text: post.text,
        userId: post.userId,
        createdAt: new Date(post.createdAt),
      };
    }) as Array<Post>;
  } catch (error) {
    throw new Error();
  }

  function getQuery() {
    return gql`
      query Posts($userId: ID!, $offset: Int!, $limit: Int!) {
        posts(userId: $userId, offset: $offset, limit: $limit) {
          id
          text
          userId
          createdAt
          __typename
        }
      }
    `;
  }

  function getVariables(userId: string, offset: number, limit: number) {
    return {
      userId,
      offset,
      limit,
    };
  }
}
