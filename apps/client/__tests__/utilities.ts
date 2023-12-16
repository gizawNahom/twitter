import { ApolloClient, HttpLink, InMemoryCache } from '@apollo/client';
import fetch from 'cross-fetch';
import { Client } from '../utilities/httpClient';

export function setCLient() {
  Client.client = new ApolloClient({
    link: new HttpLink({
      uri: process.env.NEXT_PUBLIC_API_BASE_URL,
      fetch: fetch,
    }),
    cache: new InMemoryCache(),
  });
}

export async function resetClientStore() {
  await Client.client.resetStore();
}
