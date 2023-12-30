import { AppProps } from 'next/app';
import Head from 'next/head';
import './global.css';
import { Client } from '../utilities/httpClient';
import { ApolloClient, InMemoryCache } from '@apollo/client';
import { Providers } from '../lib/providers';

if (process.env.NEXT_PUBLIC_API_MOCKING === 'enabled') {
  require('../mocks');
}

Client.client = new ApolloClient({
  uri: process.env.NEXT_PUBLIC_API_BASE_URL,
  cache: new InMemoryCache(),
});

function CustomApp({ Component, pageProps }: AppProps) {
  return (
    <Providers>
      <Head>
        <title>Welcome to boss!</title>
      </Head>
      <main className="app">
        <Component {...pageProps} />
      </main>
    </Providers>
  );
}

export default CustomApp;
