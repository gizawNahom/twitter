import { ApolloClient, HttpLink, InMemoryCache, makeVar } from '@apollo/client';
import { setContext } from '@apollo/client/link/context';

export const loadingMessagesVar = makeVar<string[]>([]);

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
            chats: {
              keyArgs: false,
              merge(existing, incoming) {
                return merger1(existing, incoming);
              },
            },
            messages: {
              keyArgs: ['chatId'],
              merge(existing, incoming) {
                return merger1(existing, incoming);
              },
            },
          },
        },
        Message: {
          fields: {
            isLoading: {
              read(_, { readField }) {
                return loadingMessagesVar().includes(readField('id') ?? '');
              },
            },
          },
        },
      },
    }),
  });
}

export class EndOfListError extends Error {}

export function merger(
  existing: { id: string }[] = [],
  incoming: { id: string }[]
) {
  if (incoming.length == 0) throw new EndOfListError();
  const mergedElements = [...existing];
  incoming.forEach((ie) => {
    if (!isDuplicate(ie)) mergedElements.push(ie);
  });
  return mergedElements;

  function isDuplicate(ie: { id: string }) {
    return mergedElements.findIndex((me) => me.id === ie.id) !== -1;
  }
}

export function merger1(
  existing: { __ref: string }[] = [],
  incoming: { __ref: string }[]
) {
  if (existing.length != 0 && incoming.length == 0) throw new EndOfListError();
  const mergedElements = [...existing];
  incoming.forEach((ie) => {
    if (!isDuplicate(ie)) mergedElements.push(ie);
  });
  return mergedElements;

  function isDuplicate(ie: { __ref: string }) {
    return mergedElements.findIndex((me) => me.__ref === ie.__ref) !== -1;
  }
}
