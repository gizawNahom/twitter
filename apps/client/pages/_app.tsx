import { AppProps } from 'next/app';
import Head from 'next/head';
import './global.css';
import { Client } from '../utilities/client';
import { ApolloClient, InMemoryCache } from '@apollo/client';
import { Providers } from '../lib/providers';
import { Nav } from '../components/nav';

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
        <title>Welcome to twitter!</title>
      </Head>
      <main className="flex ">
        <Nav></Nav>
        <div className="grow lg:basis-1/2">
          <Component {...pageProps} />
        </div>
      </main>
    </Providers>
  );
}

export default CustomApp;
