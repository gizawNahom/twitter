import { AppProps } from 'next/app';
import Head from 'next/head';
import './global.css';
import { Client } from '../utilities/client';
import { ApolloClient, InMemoryCache } from '@apollo/client';
import { Providers } from '../lib/providers';
import { App } from '../components/app';
import { offsetLimitPagination } from '@apollo/client/utilities';

if (process.env.NEXT_PUBLIC_API_MOCKING === 'enabled') {
  require('../mocks');
}

Client.client = new ApolloClient({
  uri: process.env.NEXT_PUBLIC_API_BASE_URL,
  cache: new InMemoryCache({
    typePolicies: {
      Query: {
        fields: {
          posts: offsetLimitPagination(['id']),
        },
      },
    },
  }),
});

function CustomApp({ Component, pageProps }: AppProps) {
  return (
    <Providers>
      <Head>
        <title>Welcome to twitter!</title>
      </Head>
      <main>
        <App>
          <Component {...pageProps} />
        </App>
      </main>
    </Providers>
  );
}

export default CustomApp;
