import { gql } from '@apollo/client';
import { Client } from './client';

export async function getUsers(
  username: string,
  limit: number,
  offset: number
): Promise<User[]> {
  try {
    const res = await Client.client.query({
      query: getQuery(),
      variables: getVariables(username, offset, limit),
    });

    return res.data.users as Array<User>;
  } catch (error) {
    throw new Error();
  }

  function getQuery() {
    return gql`
      query GetUsers($username: String!, $limit: Int!, $offset: Int!) {
        users(username: $username, limit: $limit, offset: $offset) {
          username
          displayName
          profilePic
        }
      }
    `;
  }

  function getVariables(username: string, offset: number, limit: number) {
    return {
      username,
      offset,
      limit,
    };
  }
}

export interface User {
  username: string;
  displayName: string;
  profilePic: string;
}
