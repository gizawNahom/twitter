import { ApolloCache, DocumentNode, gql, Reference } from '@apollo/client';
import { setUpClient } from '../__tests__/testUtilities';
import { ApolloMessagesUpdated } from '../lib/messages/data-source-apollo/apolloMessagesUpdated';
import { Client } from '../utilities/client';
import { Message } from '../lib/messages/core/domain/message';
import { buildMessage } from './generator';
import { waitFor } from '@testing-library/react';

setUpClient();

test('a single "remove" call does not prevent other subscribers', async () => {
  const chatId = 'chatId1';
  let handler2WasCalled = false;
  const { handler1, handler2 } = setUpHandlers();
  const client = Client.client;
  const event = new ApolloMessagesUpdated(client);

  event.add(handler1, chatId);
  event.add(handler2, chatId);
  event.remove(handler1, chatId);
  updateCache(client.cache, buildMessage({ chatId }));

  await waitFor(() => {
    expect(handler2WasCalled).toBe(true);
  });

  function setUpHandlers() {
    const handler1 = () => {
      //
    };
    const handler2 = () => {
      handler2WasCalled = true;
    };
    return { handler1, handler2 };
  }
});

function updateCache(cache: ApolloCache<object>, message: Message) {
  cache.writeQuery({
    ...buildMessagesQuery(message.chatId),
    data: {
      messages: [message],
    },
  });

  function buildMessagesQuery(chatId: string): {
    query: DocumentNode;
    variables: { chatId: string };
  } {
    return {
      query: gql`
        query ReadMessages($chatId: String!) {
          messages(chatId: $chatId) {
            id
            senderId
            chatId
            text
            createdAt
          }
        }
      `,
      variables: {
        chatId: chatId,
      },
    };
  }
}
