import { ApolloQueryResult, gql } from '@apollo/client';
import { Post } from './post';
import { Client } from '../../../../utilities/client';

export async function searchPosts(
  query: string,
  offset: number,
  limit: number
): Promise<Array<Post>> {
  try {
    return await trySearchPosts(query, offset, limit);
  } catch (error) {
    throw new Error();
  }

  async function trySearchPosts(query: string, offset: number, limit: number) {
    return buildPosts(await getRequestResponse(query, offset, limit));

    async function getRequestResponse(
      query: string,
      offset: number,
      limit: number
    ) {
      return await Client.client.query({
        query: getQuery(),
        variables: getVariables(query, offset, limit),
      });

      function getQuery() {
        return gql`
          query SearchPosts($query: String!, $limit: Int!, $offset: Int!) {
            searchPosts(query: $query, limit: $limit, offset: $offset) {
              id
              text
              userId
              createdAt
            }
          }
        `;
      }

      function getVariables(query: string, offset: number, limit: number) {
        return {
          query,
          offset,
          limit,
        };
      }
    }

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    function buildPosts(res: ApolloQueryResult<any>) {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      return res.data.searchPosts.map((post: any) => {
        return {
          id: post.id,
          text: post.text,
          userId: post.userId,
          createdAt: new Date(post.createdAt),
        };
      }) as Array<Post>;
    }
  }
}
