import { AppProps } from 'next/app';
import Head from 'next/head';
import './global.css';
import { Client, createClient } from '../utilities/client';
import { HttpLink } from '@apollo/client';
import { Providers } from '../lib/providers';
import { App } from '../components/app';
import { AuthProvider } from '../lib/auth/authContext';

if (process.env.NEXT_PUBLIC_API_MOCKING === 'enabled') {
  require('../mocks');
}

Client.client = createClient(
  new HttpLink({
    uri: process.env.NEXT_PUBLIC_API_BASE_URL,
  })
);

function CustomApp({ Component, pageProps }: AppProps) {
  return (
    <Providers>
      <Head>
        <title>Welcome to twitter!</title>
      </Head>
      <main>
        <App>
          <AuthProvider>
            <Component {...pageProps} />
          </AuthProvider>
        </App>
      </main>
    </Providers>
  );
}

export default CustomApp;
