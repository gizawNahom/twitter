import chatsDB from '../../test/data/chats';
import { setUpApi } from '../testUtilities';
import { buildChat } from '../../test/generator';
import { ApolloChatsGetter } from '../../lib/messages/data-source-apollo/apolloChatsGetter';
import { EndOfListError } from '../../utilities/client';

const generatedChats = [buildChat(), buildChat(), buildChat(), buildChat()];

async function getChats(offset: number) {
  const chatsGetter = new ApolloChatsGetter();
  return await chatsGetter.getChats(offset);
}

setUpApi();

beforeEach(() => {
  chatsDB.clear();
});

test('fetches chats', async () => {
  await chatsDB.create(generatedChats[0]);
  await chatsDB.create(generatedChats[1]);
  await chatsDB.create(generatedChats[2]);
  await chatsDB.create(generatedChats[3]);

  const chats1 = await getChats(0);
  const chats2 = await getChats(1);

  expect(chats1).toStrictEqual(generatedChats.slice(0, 3));
  expect(chats2).toStrictEqual(generatedChats);
});

test('returns empty when chat is empty', async () => {
  const result = await getChats(0);

  expect(result).toStrictEqual([]);
});

test('throws if it is the end of the list', async () => {
  await chatsDB.create(generatedChats[0]);
  await getChats(0);

  await expect(async () => await getChats(1)).rejects.toThrow(EndOfListError);
});
