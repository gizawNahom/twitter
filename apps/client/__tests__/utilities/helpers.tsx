import { ApolloClient, HttpLink, InMemoryCache } from '@apollo/client';
import fetch from 'cross-fetch';
import { Client } from '../../utilities/client';
import { Provider } from 'react-redux';
import { reducer } from '../../lib/redux/rootReducer';
import { configureStore } from '@reduxjs/toolkit';
import { render } from '@testing-library/react';
import { server } from '../../mocks/server';
import { GraphQLInteraction, Pact } from '@pact-foundation/pact';
import { samplePostResponse } from '../../mocks/values';
import { Post } from '../../lib/redux/slices/postsSlice/post';
import { AnyTemplate } from '@pact-foundation/pact/src/dsl/matchers';

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

export function renderElement(element: JSX.Element) {
  render(addNewStore(element));
}

function addNewStore(component: JSX.Element) {
  const store = configureStore({
    reducer,
    middleware: (getDefaultMiddleware) => {
      return getDefaultMiddleware({
        serializableCheck: false,
      });
    },
  });
  return <Provider store={store}>{component}</Provider>;
}

export function setUpMSW() {
  beforeAll(() =>
    server.listen({
      onUnhandledRequest: 'error',
    })
  );
  afterEach(() => server.resetHandlers());
  afterAll(() => server.close());
}

export function createBaseInteraction(baseUrl: URL, responseBody: AnyTemplate) {
  const PATH_NAME = baseUrl.pathname;

  return new GraphQLInteraction()
    .withRequest({
      path: PATH_NAME,
      method: 'POST',
    })
    .willRespondWith({
      status: 200,
      headers: {
        'Content-Type': 'application/json; charset=utf-8',
      },
      body: responseBody,
    });
}

export async function addInteraction(
  provider: Pact,
  interaction: GraphQLInteraction
) {
  await provider.addInteraction(interaction);
}

export function assertPostEquality(post: Post | null) {
  expect(post).toEqual({
    id: samplePostResponse.id,
    text: samplePostResponse.text,
    userId: samplePostResponse.userId,
    createdAt: new Date(samplePostResponse.createdAt),
  });
}
