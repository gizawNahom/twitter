import { renderHook, RenderHookResult } from '@testing-library/react';
import { useSubscribeToMessages1 } from '../lib/messages/presentation/hooks/useReadMessages';
import {
  MessageStore,
  CustomEvent,
} from '../lib/messages/data-source-apollo/apolloMessageStore';
import { Message } from '../lib/messages/core/domain/message';
import { act } from 'react-dom/test-utils';
import { buildMessage } from './generator';

function renderSUT(
  spy: FakeMessageStore
): RenderHookResult<ReturnType<typeof useSubscribeToMessages1>, unknown> {
  return renderHook(() => useSubscribeToMessages1(spy));
}

let fake: FakeMessageStore;

beforeEach(() => {
  fake = new FakeMessageStore();
});

describe('does not subscribe', () => {
  test.each([[''], [undefined]])('if chatId is %s', (chatId) => {
    const { result } = renderSUT(fake);

    act(() => {
      result.current.subscribe(chatId);
      fake.messagesUpdated.dispatch([buildMessage()], chatId as string);
    });

    expect(result.current.messages).toStrictEqual(undefined);
  });
});

test('subscribes to messages', async () => {
  const chatId = 'chatId1';
  const { result } = renderSUT(fake);
  const message = buildMessage();

  act(() => {
    result.current.subscribe(chatId);
    fake.messagesUpdated.dispatch([message], chatId);
  });

  expect(result.current.messages).toStrictEqual([message]);
});

test.todo('unsubscribes on unmount');
test.todo('does not subscribe if called with the same chat id');
test.todo(
  'unsubscribes chat id if subscribe is called with a different chatId'
);

class FakeMessageStore implements MessageStore {
  messagesUpdated: CustomEvent<Message[]>;

  constructor() {
    this.messagesUpdated = new CustomEvent<Message[]>(
      this.subscribeToMessages.bind(this),
      this.unsubscribeFromMessages.bind(this)
    );
  }

  private subscribeToMessages(chatId: string) {
    //
  }
  private unsubscribeFromMessages(chatId: string) {
    //
  }
}
