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

function subscribe(
  current: {
    messages: Message[] | undefined;
    subscribe: (chatId: string | undefined) => void;
  },
  chatId: string
) {
  act(() => {
    current.subscribe(chatId);
  });
}

function dispatch(message: Message, chatId: string) {
  act(() => {
    fakeSpy.messagesUpdated.dispatch([message], chatId);
  });
}

function getMessages(current: {
  messages: Message[] | undefined;
  subscribe: (chatId: string | undefined) => void;
}): Message[] | undefined {
  return current.messages;
}

let fakeSpy: FakeSpyMessageStore;

beforeEach(() => {
  fakeSpy = new FakeSpyMessageStore();
});

describe('does not subscribe', () => {
  test.each([[''], [undefined]])('if chatId is %s', (chatId) => {
    const { result } = renderSUT(fakeSpy);

    subscribe(result.current, chatId as string);
    dispatch(buildMessage(), chatId as string);

    expect(getMessages(result.current)).toStrictEqual(undefined);
  });
});

test('subscribes to messages', () => {
  const chatId = 'chatId1';
  const { result } = renderSUT(fakeSpy);
  const message = buildMessage();

  subscribe(result.current, chatId);
  dispatch(message, chatId);

  expect(getMessages(result.current)).toStrictEqual([message]);
});

test('removes handler on unmount', () => {
  const chatId = 'chatId1';
  const { result, unmount } = renderSUT(fakeSpy);

  subscribe(result.current, chatId);
  act(() => {
    unmount();
  });

  expect(fakeSpy.unsubscribeCalls).toStrictEqual([chatId]);
});

test('does not subscribe if called with the same chat id', () => {
  const chatId = 'chatId1';
  const { result } = renderSUT(fakeSpy);

  subscribe(result.current, chatId);
  subscribe(result.current, chatId);

  expect(fakeSpy.subscribeCalls).toStrictEqual([chatId]);
});

test.todo(
  'unsubscribes chat id if subscribe is called with a different chatId'
);

class FakeSpyMessageStore implements MessageStore {
  messagesUpdated: CustomEvent<Message[]>;
  subscribeCalls: string[] = [];
  unsubscribeCalls: string[] = [];

  constructor() {
    this.messagesUpdated = new CustomEvent<Message[]>(
      this.subscribeToMessages.bind(this),
      this.unsubscribeFromMessages.bind(this)
    );
  }

  private subscribeToMessages(chatId: string) {
    this.subscribeCalls.push(chatId);
  }
  private unsubscribeFromMessages(chatId: string) {
    this.unsubscribeCalls.push(chatId);
  }
}
