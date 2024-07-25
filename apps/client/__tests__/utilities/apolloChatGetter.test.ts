import chatsDB from '../../test/data/chats';
import { setUpApi } from '../testUtilities';
import { act, renderHook, waitFor } from '@testing-library/react';
import { buildChat } from '../../test/generator';
import {
  ApolloChatsGetter,
  useApolloGetChats,
} from '../../lib/messages/data/apolloChatsGetter';
import { Chat } from '../../lib/messages/core/domain/chat';

const generatedChats = [buildChat(), buildChat(), buildChat(), buildChat()];

function createSUT(limit = 2) {
  const { result } = renderHook(() =>
    useApolloGetChats(() => {
      //
    })
  );
  return {
    chatsGetter: new ApolloChatsGetter(
      result.current.getChats,
      result.current.fetchMore,
      limit
    ),
    result,
  };
}

async function getChats(chatsGetter: ApolloChatsGetter) {
  let chats: Chat[] | undefined;
  await act(async () => {
    chats = await chatsGetter.getChats();
  });
  return chats;
}

setUpApi();

beforeEach(() => {
  chatsDB.clear();
});

test('works if there are no chats', async () => {
  const { chatsGetter, result } = createSUT();

  const chats = await getChats(chatsGetter);

  expect(chats).toStrictEqual([]);
  expect(result.current.chats?.chats).toStrictEqual([]);
});

test('works when called once', async () => {
  await chatsDB.create(generatedChats[0]);
  await chatsDB.create(generatedChats[1]);
  const { chatsGetter, result } = createSUT();

  const chats = await getChats(chatsGetter);

  expect(chats).toStrictEqual([generatedChats[0], generatedChats[1]]);
  expect(result.current.chats?.chats).toStrictEqual([
    generatedChats[0],
    generatedChats[1],
  ]);
});

test('works when called twice', async () => {
  await chatsDB.create(generatedChats[0]);
  await chatsDB.create(generatedChats[1]);
  await chatsDB.create(generatedChats[2]);
  await chatsDB.create(generatedChats[3]);
  const { chatsGetter, result } = createSUT();

  const chats1 = await getChats(chatsGetter);
  const chats2 = await getChats(chatsGetter);

  expect(chats1).toStrictEqual(generatedChats.slice(0, 2));
  expect(chats2).toStrictEqual(generatedChats.slice(2, 4));
  await waitFor(() => {
    expect(result.current.chats?.chats).toStrictEqual(generatedChats);
  });
});

test('works when called four times', async () => {
  await chatsDB.create(generatedChats[0]);
  await chatsDB.create(generatedChats[1]);
  await chatsDB.create(generatedChats[2]);
  await chatsDB.create(generatedChats[3]);
  const { chatsGetter, result } = createSUT();

  const chats1 = await getChats(chatsGetter);
  const chats2 = await getChats(chatsGetter);
  const chats3 = await getChats(chatsGetter);
  const chats4 = await getChats(chatsGetter);

  expect(chats1).toStrictEqual(generatedChats.slice(0, 2));
  expect(chats2).toStrictEqual(generatedChats.slice(2, 4));
  expect(chats3).toStrictEqual([]);
  expect(chats4).toStrictEqual([]);
  await waitFor(() => {
    expect(result.current.chats?.chats).toStrictEqual(generatedChats);
  });
});
