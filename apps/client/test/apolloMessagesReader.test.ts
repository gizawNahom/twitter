import { setUpApi } from '../__tests__/testUtilities';
import { Message } from '../lib/messages/core/domain/message';
import { ApolloMessagesReader } from '../lib/messages/data-source-apollo/apolloMessagesReader';
import { sampleChatResponse } from '../mocks/values';
import { EndOfListError } from '../utilities/client';
import messagesDB from './data/messages';
import { buildMessage } from './generator';

let messagesReader: ApolloMessagesReader;

async function createMessages(n: number) {
  for (let i = 0; i < n; i++) {
    await messagesDB.create(sampleChatResponse.id, buildMessage());
  }
}

async function getSavedMessages(offset: number, limit: number) {
  return (await messagesDB.read(
    offset,
    limit,
    sampleChatResponse.id
  )) as Message[];
}

async function readMessages(offset: number, limit: number) {
  return await messagesReader.readMessages(
    offset,
    limit,
    sampleChatResponse.id
  );
}

setUpApi();

beforeEach(() => {
  messagesDB.clear();
  messagesReader = new ApolloMessagesReader();
});

test('works on multiple read calls', async () => {
  await createMessages(4);

  const messages1 = await readMessages(0, 2);
  const messages2 = await readMessages(1, 2);

  const expectedMessages1 = await getSavedMessages(0, 2);
  const expectedMessages2 = await getSavedMessages(1, 2);

  expect(messages1).toStrictEqual(expectedMessages1);
  expect(messages2).toStrictEqual([...expectedMessages1, ...expectedMessages2]);
});

test('throws end of list error when empty array is returned', async () => {
  await createMessages(2);
  await readMessages(0, 2);

  await expect(async () => await readMessages(1, 2)).rejects.toThrow(
    EndOfListError
  );
});
