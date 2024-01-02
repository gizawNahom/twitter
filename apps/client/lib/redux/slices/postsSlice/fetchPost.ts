import { gql } from '@apollo/client';
import { Client } from '../../../../utilities/client';
import { Post } from './post';

export async function fetchPost(id: string): Promise<Post> {
  const res = await Client.client.query({
    query: getQuery(),
    variables: getVariables(id),
  });

  if (res.error) throw new Error();

  const post = res.data.post;

  return {
    id: post.id,
    text: post.text,
    userId: post.userId,
    createdAt: new Date(post.createdAt),
  };

  function getQuery() {
    return gql`
      query post($id: ID!) {
        post(id: $id) {
          id
          text
          userId
          createdAt
        }
      }
    `;
  }

  function getVariables(id: string) {
    return {
      id,
    };
  }
}
