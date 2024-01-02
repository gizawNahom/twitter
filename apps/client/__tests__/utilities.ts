import { ApolloClient, HttpLink, InMemoryCache } from '@apollo/client';
import fetch from 'cross-fetch';
import { Client } from '../utilities/client';

export function setUpClient() {
  beforeAll(() => {
    setCLient();
  });

  afterEach(async () => {
    await resetClientStore();
  });

  function setCLient() {
    Client.client = new ApolloClient({
      link: new HttpLink({
        uri: process.env.NEXT_PUBLIC_API_BASE_URL,
        fetch: fetch,
      }),
      cache: new InMemoryCache(),
    });
  }

  async function resetClientStore() {
    await Client.client.resetStore();
  }
}
