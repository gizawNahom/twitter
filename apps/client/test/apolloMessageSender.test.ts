import { setUpApi } from '../__tests__/testUtilities';
import { Message } from '../lib/messages/core/domain/message';
import { ApolloMessageSender } from '../lib/messages/data-source-apollo/apolloMessageSender';
import { READ_MESSAGES_QUERY } from '../lib/messages/data-source-apollo/apolloMessagesUpdated';
import { Client } from '../utilities/client';

setUpApi();

test('returns sent message', async () => {
  const chatId = 'chatId1';
  const text = 'sample';
  const senderId = 'senderId';
  const sender = new ApolloMessageSender(Client.client);
  await sender.sendMessage(senderId, text, chatId);

  const messages = readCache(chatId).messages as Message[];
  expect(messages).toHaveLength(1);
  assertSentMessage(messages[0]);

  function assertSentMessage(message: Message) {
    expect(message.text).toBe(text);
    expect(message.chatId).toBe(chatId);
    expect(message.isLoading).toBe(false);
    expect(message.senderId).toBe(senderId);
    expect(removeSeconds(message.createdAt)).toBe(
      removeSeconds(new Date().toISOString())
    );
  }
});

function readCache(chatId: string) {
  return Client.client.readQuery(
    {
      query: READ_MESSAGES_QUERY,
      variables: { chatId },
    },
    true
  );
}

function removeSeconds(isoString: string) {
  return isoString.slice(0, isoString.lastIndexOf(':'));
}

// const responsePromise = messageSender.sendMessage(input);

//   // Check the cache immediately after sending the message
//   const optimisticCacheData = client.cache.readQuery({
//     query: gql`
//       query GetMessages {
//         messages {
//           id
//           content
//         }
//       }
//     `,
//   });

//   // Check that the optimistic data is present in the cache
//   expect(optimisticCacheData).toEqual({
//     messages: [
//       expect.objectContaining({
//         id: 'temp-id', // This should match the optimistic response ID
//         content: input.content,
//       }),
//     ],
//   });

//   // Wait for the actual response
//   const response = await responsePromise;

test.todo(`creates optimistic message`);
test.todo(`only adds message to its chat`);
