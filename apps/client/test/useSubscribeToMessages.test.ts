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
  fakeSpy: FakeSpyMessageStore
): RenderHookResult<ReturnType<typeof useSubscribeToMessages1>, unknown> {
  return renderHook(() => useSubscribeToMessages1(fakeSpy));
}

let fakeSpy: FakeSpyMessageStore;

beforeEach(() => {
  fakeSpy = new FakeSpyMessageStore();
});

describe('does not subscribe', () => {
  test.each([[''], [undefined]])('if chatId is %s', (chatId) => {
    const { result } = renderSUT(fakeSpy);

    act(() => {
      result.current.subscribe(chatId);
      fakeSpy.messagesUpdated.dispatch([buildMessage()], chatId as string);
    });

    expect(result.current.messages).toStrictEqual(undefined);
  });
});

test('subscribes to messages', async () => {
  const chatId = 'chatId1';
  const { result } = renderSUT(fakeSpy);
  const message = buildMessage();

  act(() => {
    result.current.subscribe(chatId);
  });
  act(() => {
    fakeSpy.messagesUpdated.dispatch([message], chatId);
  });

  expect(result.current.messages).toStrictEqual([message]);
});

test('removes handler on unmount', async () => {
  const chatId = 'chatId1';
  const { result, unmount } = renderSUT(fakeSpy);

  act(() => {
    result.current.subscribe(chatId);
  });
  act(() => {
    unmount();
  });

  expect(fakeSpy.unsubscribeCalls).toStrictEqual([chatId]);
});

test.todo('does not subscribe if called with the same chat id');
test.todo(
  'unsubscribes chat id if subscribe is called with a different chatId'
);

class FakeSpyMessageStore implements MessageStore {
  messagesUpdated: CustomEvent<Message[]>;
  unsubscribeCalls: string[] = [];

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
    this.unsubscribeCalls.push(chatId);
  }
}
