import chatsDB from '../../test/data/chats';
import { setUpApi } from '../testUtilities';
import { act, renderHook, waitFor } from '@testing-library/react';
import { buildChat } from '../../test/generator';
import {
  ApChatsGetter,
  // ApolloChatsGetter,
  // ApolloChatsGetter1,
  // useApolloGetChats,
} from '../../lib/messages/data/apolloChatsGetter';
import { Chat } from '../../lib/messages/core/domain/chat';

const generatedChats = [buildChat(), buildChat(), buildChat(), buildChat()];

// function createSUT(limit = 2) {
//   const { result } = renderHook(() =>
//     useApolloGetChats(() => {
//       //
//     })
//   );
//   return {
//     chatsGetter: new ApolloChatsGetter(
//       result.current.getChats,
//       result.current.fetchMore,
//       limit
//     ),
//     result,
//   };
// }

// async function getChats(chatsGetter: ApolloChatsGetter) {
//   let chats: Chat[] | undefined;
//   await act(async () => {
//     chats = await chatsGetter.getChats();
//   });
//   return chats;
// }

// async function getChats1(
//   chatsGetter: ApolloChatsGetter,
//   currentChats: Chat[] | undefined
// ) {
//   let chats: Chat[] | undefined;
//   await act(async () => {
//     chats = await chatsGetter.getChats1(currentChats);
//   });
//   return chats;
// }

// async function getChats2(
//   currentChats: Chat[] | undefined,
//   queryFunction: any,
//   fetchMore: any
// ) {
//   const chatsGetter = new ApolloChatsGetter1(
//     queryFunction,
//     fetchMore,
//     2,
//     currentChats
//   );
//   let chats: Chat[] | undefined;
//   await act(async () => {
//     chats = await chatsGetter.getChats();
//   });
//   return chats;
// }

async function getChats21(offset: number) {
  const chatsGetter = new ApChatsGetter(offset);
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

// test('works if there are no chats', async () => {
//   const { chatsGetter, result } = createSUT();

//   const chats = await getChats(chatsGetter);

//   expect(chats).toStrictEqual([]);
//   expect(result.current.chats?.chats).toStrictEqual([]);
// });

// test('works when called once', async () => {
//   await chatsDB.create(generatedChats[0]);
//   await chatsDB.create(generatedChats[1]);
//   const { chatsGetter, result } = createSUT();

//   const chats = await getChats(chatsGetter);

//   expect(chats).toStrictEqual([generatedChats[0], generatedChats[1]]);
//   expect(result.current.chats?.chats).toStrictEqual([
//     generatedChats[0],
//     generatedChats[1],
//   ]);
// });

// test('works when called twice', async () => {
//   await chatsDB.create(generatedChats[0]);
//   await chatsDB.create(generatedChats[1]);
//   await chatsDB.create(generatedChats[2]);
//   await chatsDB.create(generatedChats[3]);
//   const { result } = createSUT();

//   // const chats1 = await getChats(chatsGetter);
//   // const chats2 = await getChats(chatsGetter);
//   // const chats1 = await getChats1(chatsGetter, result.current.chats?.chats);
//   // const chats2 = await getChats1(chatsGetter, result.current.chats?.chats);
//   const chats1 = await getChats2(
//     result.current.chats?.chats,
//     result.current.getChats,
//     result.current.fetchMore
//   );
//   const chats2 = await getChats2(
//     result.current.chats?.chats,
//     result.current.getChats,
//     result.current.fetchMore
//   );

//   expect(chats1).toStrictEqual(generatedChats.slice(0, 2));
//   expect(chats2).toStrictEqual(generatedChats.slice(2, 4));
//   await waitFor(() => {
//     expect(result.current.chats?.chats).toStrictEqual(generatedChats);
//   });
// });

// test('works when called four times', async () => {
//   await chatsDB.create(generatedChats[0]);
//   await chatsDB.create(generatedChats[1]);
//   await chatsDB.create(generatedChats[2]);
//   await chatsDB.create(generatedChats[3]);
//   const { chatsGetter, result } = createSUT();

//   // const chats1 = await getChats(chatsGetter);
//   // const chats2 = await getChats(chatsGetter);
//   // const chats3 = await getChats(chatsGetter);
//   // const chats4 = await getChats(chatsGetter);
//   const chats1 = await getChats2(
//     result.current.chats?.chats,
//     result.current.getChats,
//     result.current.fetchMore
//   );
//   const chats2 = await getChats2(
//     result.current.chats?.chats,
//     result.current.getChats,
//     result.current.fetchMore
//   );
//   console.log(`GENERATED CHATS`);
//   console.log(generatedChats);
//   console.log(`

//     BETWEEN 2 & 3`);
//   console.log(result.current.chats?.chats);

//   const chats3 = await getChats2(
//     result.current.chats?.chats,
//     result.current.getChats,
//     result.current.fetchMore
//   );
//   const chats4 = await getChats2(
//     result.current.chats?.chats,
//     result.current.getChats,
//     result.current.fetchMore
//   );

//   console.log(`

//     CHATS 3`);
//   console.log(chats3);

//   expect(chats1).toStrictEqual(generatedChats.slice(0, 2));
//   expect(chats2).toStrictEqual(generatedChats.slice(2, 4));
//   expect(chats3).toStrictEqual([]);
//   expect(chats4).toStrictEqual([]);
//   await waitFor(() => {
//     expect(result.current.chats?.chats).toStrictEqual(generatedChats);
//   });
// });
test('works when called four times', async () => {
  await chatsDB.create(generatedChats[0]);
  await chatsDB.create(generatedChats[1]);
  await chatsDB.create(generatedChats[2]);
  await chatsDB.create(generatedChats[3]);

  const chats1 = await getChats21(0);
  const chats2 = await getChats21(1);
  // const chats3 = await getChats21(2);
  // const chats4 = await getChats21(3);

  expect(chats1).toStrictEqual(generatedChats.slice(0, 3));
  expect(chats2).toStrictEqual(generatedChats);
  // expect(chats3).toStrictEqual(generatedChats);
  // expect(chats4).toStrictEqual(generatedChats);
  // await waitFor(() => {
  //   expect(result.current.chats?.chats).toStrictEqual(generatedChats);
  // });
});
