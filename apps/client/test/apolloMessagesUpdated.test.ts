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
  const chatId = message.chatId;
  const newMessageRef = createNewMessageRef(cache, message);
  addToMessages(cache, newMessageRef);

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

  function addToMessages(
    cache: ApolloCache<object>,
    newMessageRef: Reference | undefined
  ) {
    const messagesQuery = buildMessagesQuery(chatId);
    const existingMessages = getExistingMessages(cache, messagesQuery);
    if (!existingMessages)
      initializeMessagesWithEmptyArray(cache, messagesQuery);
    modifyMessages(cache, newMessageRef);

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

    function getExistingMessages(
      cache: ApolloCache<object>,
      messagesQuery: {
        query: DocumentNode;
        variables: { chatId: string };
      }
    ) {
      return cache.readQuery(messagesQuery);
    }

    function initializeMessagesWithEmptyArray(
      cache: ApolloCache<object>,
      messagesQuery: {
        query: DocumentNode;
        variables: { chatId: string };
      }
    ) {
      cache.writeQuery({
        ...messagesQuery,
        data: {
          messages: [],
        },
      });
    }

    function modifyMessages(
      cache: ApolloCache<object>,
      newMessageRef: Reference | undefined
    ) {
      cache.modify({
        fields: {
          messages(existingMessages = []) {
            return [...existingMessages, newMessageRef];
          },
        },
      });
    }
  }
}
