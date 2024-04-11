import { ApolloClient, HttpLink, InMemoryCache } from '@apollo/client';
import fetch from 'cross-fetch';
import { Client } from '../../utilities/client';
import { server } from '../../mocks/server';
import { useRouter } from 'next/router';

export function setUpMockRouter({
  back,
  push,
  query,
}: {
  back?: jest.Mock;
  push?: jest.Mock;
  query?: object;
}) {
  function mockRouter({
    back,
    push,
    query,
  }: {
    back?: jest.Mock;
    push?: jest.Mock;
    query?: object;
  }) {
    const router = useRouter as jest.Mock;
    router.mockImplementation(() => ({
      back: back,
      push: push,
      query,
    }));
  }

  beforeEach(() => {
    mockRouter({ back, push, query });
  });

  afterEach(() => {
    jest.resetAllMocks();
  });
}

export function setUpApi() {
  setUpClient();
  setUpMSW();

  function setUpMSW() {
    beforeAll(() =>
      server.listen({
        onUnhandledRequest: 'error',
      })
    );
    afterEach(() => server.resetHandlers());
    afterAll(() => server.close());
  }
}

export function setUpClient() {
  beforeEach(() => {
    setCLient();
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
}
