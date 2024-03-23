import { ApolloClient, HttpLink, InMemoryCache } from '@apollo/client';
import fetch from 'cross-fetch';
import { Client } from '../../utilities/client';
import { Provider } from 'react-redux';
import { reducer } from '../../lib/redux/rootReducer';
import { configureStore } from '@reduxjs/toolkit';
import { render, screen } from '@testing-library/react';
import { server } from '../../mocks/server';
import { ERROR_TEST_ID, SPINNER_TEST_ID } from './testIds';
import userEvent from '@testing-library/user-event';
import { POST_BUTTON_TEXT } from './texts';
import { useRouter } from 'next/router';

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

export function renderElement(element: JSX.Element, store = createNewStore()) {
  render(<Provider store={store}>{element}</Provider>);
}

export function createNewStore() {
  return configureStore({
    reducer,
    middleware: (getDefaultMiddleware) => {
      return getDefaultMiddleware({
        serializableCheck: false,
      });
    },
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

export function queryErrorComponent(): HTMLElement | null {
  return screen.queryByTestId(ERROR_TEST_ID);
}

export function querySpinner(): HTMLElement | null {
  return screen.queryByTestId(SPINNER_TEST_ID);
}

export async function typeText(text: string) {
  await userEvent.type(screen.getByRole('textbox'), text);
}

export function clickPostButton() {
  return clickElement(screen.getByText(POST_BUTTON_TEXT));
}

export function getByPlaceholderText(text: string | RegExp): HTMLElement {
  return screen.getByPlaceholderText(text);
}

export async function clickElement(element: HTMLElement) {
  await userEvent.click(element);
}

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
