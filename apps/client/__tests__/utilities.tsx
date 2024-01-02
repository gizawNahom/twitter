import { ApolloClient, HttpLink, InMemoryCache } from '@apollo/client';
import fetch from 'cross-fetch';
import { Client } from '../utilities/client';
import { Provider } from 'react-redux';
import { reducer } from '../lib/redux/rootReducer';
import { configureStore } from '@reduxjs/toolkit';

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

export function addNewStore(component: JSX.Element) {
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
