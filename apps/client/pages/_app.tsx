import { AppProps } from 'next/app';
import Head from 'next/head';
import './global.css';
import { Client } from '../utilities/client';
import { ApolloClient, InMemoryCache } from '@apollo/client';
import { Providers } from '../lib/providers';
import { App } from '../components/app';

if (process.env.NEXT_PUBLIC_API_MOCKING === 'enabled') {
  require('../mocks');
}

Client.client = new ApolloClient({
  uri: process.env.NEXT_PUBLIC_API_BASE_URL,
  cache: new InMemoryCache({
    typePolicies: {
      Query: {
        fields: {
          posts: {
            keyArgs: false,
            // @ts-expect-error userId and offset don't exist on args
            merge(existing = {}, incoming, { args: { userId, offset = 0 } }) {
              const merged = existing[userId] ? existing[userId].slice(0) : [];

              for (let i = 0; i < incoming.length; ++i) {
                merged[offset + i] = incoming[i];
              }

              existing = { ...existing, [userId]: merged };
              console.log(existing);
              return existing;
            },
          },
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
