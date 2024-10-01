import { ApolloCache, gql } from '@apollo/client';
import { setUpClient } from '../__tests__/testUtilities';
import { ApolloMessagesUpdated } from '../lib/messages/data-source-apollo/apolloMessagesUpdated';
import { Client } from '../utilities/client';
import { Message } from '../lib/messages/core/domain/message';
import { buildMessage } from './generator';
import { waitFor } from '@testing-library/react';

setUpClient();

test('a single "remove" call does not prevent other subscribers', async () => {
  let handler2WasCalled = false;
  const { handler1, handler2 } = setUpHandlers();
  const client = Client.client;
  const event = new ApolloMessagesUpdated(client);

  event.add(handler1, 'chatId1');
  event.add(handler2, 'chatId1');
  event.remove(handler1, 'chatId1');
  updateCache();

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

  function updateCache() {
    const newMessageRef = createNewMessageRef(client.cache, buildMessage());
    client.cache.modify({
      fields: {
        messages(existingMessages = []) {
          return [...existingMessages, newMessageRef];
        },
      },
    });

    function createNewMessageRef(
      cache: ApolloCache<object>,
      sendMessage: Message
    ) {
      return cache.writeFragment({
        data: sendMessage,
        fragment: gql`
          fragment NewMessage on Message {
            id
            senderId
            chatId
            text
            createdAt
          }
        `,
      });
    }
  }
});
