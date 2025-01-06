import { HttpLink } from '@apollo/client';
import fetch from 'cross-fetch';
import { Client, createClient } from '../../utilities/client';
import { server } from '../../mocks/server';
import { useRouter } from 'next/router';

export function setUpMockRouter({
  back,
  push,
  query,
  pathname,
}: {
  back?: jest.Mock;
  push?: jest.Mock;
  query?: object;
  pathname?: string;
}) {
  beforeEach(() => {
    mockRouter({ back, push, query, pathname });
  });

  afterEach(() => {
    jest.resetAllMocks();
  });
}

export function mockRouter({
  back,
  push,
  query,
  pathname,
}: {
  back?: jest.Mock;
  push?: jest.Mock;
  query?: object;
  pathname?: string;
}) {
  const router = useRouter as jest.Mock;
  router.mockImplementation(() => ({
    back: back,
    push: push,
    query,
    pathname,
    isReady: true,
  }));
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
    Client.client = createClient(
      new HttpLink({
        uri: process.env.NEXT_PUBLIC_API_BASE_URL,
        fetch: fetch,
      })
    );
  }
}
