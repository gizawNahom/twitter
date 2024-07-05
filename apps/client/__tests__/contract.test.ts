import { setUpClient } from './testUtilities';
import { testCreatePost } from './contracts/createPostTest';
import { testFetchPost } from './contracts/fetchPostTest';
import { testFetchPosts } from './contracts/fetchPostsTest';
import { Pact } from '@pact-foundation/pact';
import path from 'path';
import { testSearchPosts } from './contracts/searchPostsTest';
import { testGetUsers } from './contracts/messages/getUsersTest';
import { testGetOrCreateChat } from './contracts/messages/getOrCreateChatTest';
import { testSendMessage } from './contracts/messages/sendMessageTest';
import { testReadMessages } from './contracts/messages/readMessagesTest';

function getBaseUrl() {
  return new URL(process.env.NEXT_PUBLIC_API_BASE_URL as string);
}

function createProvider(port: number) {
  return new Pact({
    dir: path.resolve(process.cwd(), 'pacts'),
    consumer: 'twitter-client',
    provider: 'twitter-server',
    port: port,
  });
}

function setUpContractTest(provider: Pact) {
  setUpProvider(provider);
  setUpClient();

  function setUpProvider(provider: Pact) {
    beforeEach(async () => await provider.setup());

    afterEach(async () => await provider.verify());

    afterAll(async () => await provider.finalize());
  }
}

const baseUrl = getBaseUrl();
const PORT = +baseUrl.port;

const provider = createProvider(PORT);

setUpContractTest(provider);

testCreatePost(provider, baseUrl);

testFetchPost(provider, baseUrl);

testFetchPosts(provider, baseUrl);

testSearchPosts(provider, baseUrl);

testGetUsers(provider, baseUrl);

testGetOrCreateChat(provider, baseUrl);

testSendMessage(provider, baseUrl);

testReadMessages(provider, baseUrl);
