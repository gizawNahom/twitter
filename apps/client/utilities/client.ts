import { ApolloClient, HttpLink, InMemoryCache } from '@apollo/client';
import { setContext } from '@apollo/client/link/context';

export class Client {
  static client: ApolloClient<object>;
}

export function createClient(httpLink: HttpLink): ApolloClient<object> {
  const authLink = setContext((_, { headers }) => {
    return {
      headers: {
        ...headers,
        authorization: `Bearer sampleToken`,
      },
    };
  });

  return new ApolloClient({
    link: authLink.concat(httpLink),
    cache: new InMemoryCache({
      typePolicies: {
        Query: {
          fields: {
            posts: {
              keyArgs: false,
              merge(
                existing = {},
                incoming,
                // @ts-expect-error userId and offset don't exist on args
                { args: { userId, offset = 0 } }
              ) {
                const merged = existing[userId]
                  ? existing[userId].slice(0)
                  : [];
                for (let i = 0; i < incoming.length; ++i) {
                  merged[offset + i] = incoming[i];
                }
                existing = { ...existing, [userId]: merged };
                return existing;
              },
            },
          },
        },
      },
    }),
  });
}
