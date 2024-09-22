import { renderHook } from '@testing-library/react';
import { useSubscribeToMessages1 } from '../lib/messages/presentation/hooks/useReadMessages';
import {
  MessageStore,
  CustomEvent,
} from '../lib/messages/data-source-apollo/apolloMessageStore';
import { Message } from '../lib/messages/core/domain/message';
import { act } from 'react-dom/test-utils';

describe('does not subscribe', () => {
  test.each([[''], [undefined]])('if chatId is %i', (chatId) => {
    const stub = new MessageStoreStub();
    const { result } = renderHook(() => useSubscribeToMessages1(stub));

    act(() => {
      result.current.subscribe(chatId);
    });

    expect(stub.subscribeToMessagesCalls).toHaveLength(0);
  });
});

test.todo('subscribes to messages');
test.todo('unsubscribes on unmount');
test.todo('does not subscribe if called with the same chat id');
test.todo(
  'unsubscribes chat id if subscribe is called with a different chatId'
);

class MessageStoreStub implements MessageStore {
  messagesUpdated: CustomEvent<Message[]>;
  subscribeToMessagesCalls: string[] = [];

  constructor() {
    this.messagesUpdated = new CustomEvent<Message[]>(
      this.subscribeToMessages.bind(this),
      this.unsubscribeFromMessages.bind(this)
    );
  }

  private subscribeToMessages(chatId: string) {
    this.subscribeToMessagesCalls.push(chatId);
  }
  private unsubscribeFromMessages(chatId: string) {
    //
  }
}
