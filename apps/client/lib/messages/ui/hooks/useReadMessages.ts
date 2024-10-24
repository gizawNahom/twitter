import { useEffect, useState } from 'react';
import { Message } from '../../core/domain/message';
import { formatDayForMessage } from '../utilities';
import { buildMessageStore } from '../../adapters/messageStoreImpl';
import { MessageStore } from '../../core/ports/messageStore';
import { Context } from '../../context';
import { EndOfListError } from '../../../../utilities/client';

export type MessagesByDay = Map<string, Message[]>;

export function useReadMessages(chatId: string | undefined) {
  const { messages, subscribe } = useSubscribeToMessages(buildMessageStore());
  const [hasMore, setHasMore] = useState(true);
  const [offset, setOffset] = useState(0);
  const [status, setStatus] = useState<'idle' | 'loading' | 'error'>('idle');

  useEffect(() => {
    (async () => {
      if (chatId) {
        try {
          subscribe(chatId);
          await readMessages();
        } catch (error) {
          //
        }
      }
    })();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [chatId]);

  return {
    messagesByDay: buildMessagesByDay(messages || []),
    readMessages,
    hasMore,
    offset,
  };

  async function readMessages() {
    try {
      await tryReadMessages();
    } catch (error) {
      setStatus('error');
      if (error instanceof EndOfListError) setHasMore(false);
    }

    async function tryReadMessages() {
      if (status != 'loading') {
        setStatus('loading');
        if (chatId) await Context.readMessagesUseCase.execute(offset, chatId);
        setOffset(offset + 1);
        setStatus('idle');
      }
    }
  }

  function buildMessagesByDay(messages: Message[]) {
    const prevMsgs: MessagesByDay = new Map();
    messages.forEach((m) => {
      addMessage(m, prevMsgs);
    });
    return prevMsgs;

    function addMessage(msg: Message, prevMsgs: MessagesByDay) {
      const day = formatDayForMessage(new Date(msg.createdAt));
      if (prevMsgs.has(day)) prevMsgs.get(day)?.push(msg);
      else prevMsgs.set(day, [msg]);
    }
  }
}

export function useSubscribeToMessages(messageStore: MessageStore) {
  const [messages, setMessages] = useState<Message[]>();
  const [chatId, setChatId] = useState<string>();

  useEffect(() => {
    if (chatId) messageStore.messagesUpdated.add(handleMessagesUpdate, chatId);

    return () => {
      if (chatId)
        messageStore.messagesUpdated.remove(handleMessagesUpdate, chatId);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [chatId]);

  return { messages, subscribe };

  function subscribe(chatId: string | undefined) {
    setChatId(chatId);
  }

  function handleMessagesUpdate(messages: Message[]) {
    setMessages(messages);
  }
}
