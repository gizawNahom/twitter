import Image from 'next/image';
import { useEffect, useState } from 'react';
import { createDefaultHeader, Page } from '../../../../components/page';
import { NextRouter, useRouter } from 'next/router';
import { MESSAGES_CHAT_ROUTE, MESSAGES_ROUTE } from '../utilities/routes';
import { useSelector } from 'react-redux';
import { selectSelectedUser } from '../../../redux';
import { formatTimeForMessage, formatDayForMessage } from '../utilities';
import { Spinner } from '../../../../components/spinner';
import { useGetOrCreateChat } from '../../adapters/hooks/useGetOrCreateChat';
import { PartialChat } from '../../core/domain/partialChat';
import { useSendMessage } from '../../adapters/hooks/useSendMessage';
import { readMessages } from '../../adapters/api/readMessages';
import { Message as Msg } from '../../core/domain/message';
import { User } from '../../../../utilities/getUsers';

type MessagesType = Map<string, { isToBeSent: boolean; message: Msg }[]>;

export default function Chat() {
  const [messageInput, setMessageInput] = useState('');

  const router = useRouter();
  const chatId = router.query?.chatId as string;
  const user = useSelector(selectSelectedUser);
  const { handleGetOrCreateChat, chat } = useGetOrCreateChat();
  const { messages, setMessages } = useReadMessages(chatId);
  useChatGuard(router, user, chatId);

  return (
    <Page header={renderHeader()}>
      <div>
        {messages.size == 0 && <p>No messages</p>}
        {messages.size > 0 && renderMessages()}
        <MessageSendInput
          onSend={sendMessage}
          messageInput={messageInput}
          onChange={setMessageInput}
        />
      </div>
    </Page>
  );

  function useReadMessages(chatId: string) {
    const [messages, setMessages] = useState<MessagesType>(new Map());

    useEffect(() => {
      (async () => {
        if (chatId) {
          try {
            const messages = await readMessages(chatId as string, 0, 3);
            setMessages(buildMessages(messages));
          } catch (error) {
            //
          }
        }
      })();
    }, [chatId]);

    return { messages, setMessages };
  }

  function useChatGuard(router: NextRouter, user: User | null, chatId: string) {
    useEffect(() => {
      if (router.isReady) {
        if (!user && !chatId) router.push(MESSAGES_ROUTE);
      }
    }, [router, user, chatId]);
  }

  function renderHeader() {
    return createDefaultHeader(
      <div>
        {user && (
          <div>
            <div className="w-10 h-10 relative rounded-full overflow-hidden">
              <Image
                src={user.profilePic}
                alt={`${user.username}'s profile picture`}
                fill
                className="object-cover"
              />
            </div>
            <p>{user.displayName}</p>
          </div>
        )}
      </div>
    );
  }

  function renderMessages() {
    return (
      <div role="log">
        {Array.from(messages.entries()).map(([day, messageObjects]) => {
          return (
            <div key={day}>
              <h3>{day}</h3>
              {messageObjects.map(({ isToBeSent, message }) => (
                <Message
                  key={message.id}
                  message={message}
                  chatId={message.chatId || (chat?.id as string)}
                  isToBeSent={isToBeSent}
                />
              ))}
            </div>
          );
        })}
      </div>
    );
  }

  async function sendMessage(message: string) {
    if (!chatId && !chat) {
      const c = (await handleGetOrCreateChat(
        user?.username as string
      )) as PartialChat;
      if (c) {
        addToMessages(message);
        window.history.replaceState(null, '', `${MESSAGES_CHAT_ROUTE}/${c.id}`);
        setMessageInput('');
      }
    } else {
      addToMessages(message);
      setMessageInput('');
    }
  }

  function addToMessages(message: string) {
    const newMessages = new Map(messages);
    addMessage(
      {
        id: `${Math.floor(Math.random() * 100000)}`,
        text: message,
        senderId: 'randomId1',
        chatId: chatId as string,
        createdAt: new Date().toISOString(),
      },
      newMessages,
      true
    );
    setMessages(newMessages);
  }

  function buildMessages(messages: Msg[]) {
    const prevMsgs: MessagesType = new Map();
    messages.forEach((m) => {
      addMessage(m, prevMsgs);
    });
    return prevMsgs;
  }

  function addMessage(m: Msg, prevMsgs: MessagesType, isToBeSent = false) {
    const day = formatDayForMessage(new Date(m.createdAt));
    if (prevMsgs.has(day)) prevMsgs.get(day)?.push({ isToBeSent, message: m });
    else prevMsgs.set(day, [{ isToBeSent, message: m }]);
  }
}

function Message({
  message: msg,
  chatId,
  isToBeSent,
}: {
  message: { text: string; createdAt: string };
  chatId: string;
  isToBeSent: boolean;
}) {
  const { handleSendMessage, isLoading, message } = useSendMessage();

  useEffect(() => {
    (async () => {
      if (isToBeSent) await handleSendMessage(msg.text, chatId);
    })();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <div data-testid="message">
      <p>{msg.text}</p>
      <p>{formatTimeForMessage(new Date(msg.createdAt))}</p>
      {renderStatus()}
    </div>
  );

  function renderStatus() {
    if (!isToBeSent) return <div aria-label="sent"></div>;
    else if (isLoading) return <Spinner />;
    else if (message) return <div aria-label="sent"></div>;
  }
}

export function MessageSendInput({
  onSend,
  messageInput,
  onChange,
}: {
  onSend: (message: string) => void;
  messageInput: string;
  onChange: (messageInput: string) => void;
}) {
  const trimmedMessage = messageInput.trim();

  return (
    <div data-testid="message-send-input">
      <input
        type="text"
        placeholder="Start a new message"
        value={messageInput}
        onChange={(e) => onChange(e.target.value)}
      />
      <button
        aria-label="send"
        disabled={isEmpty(trimmedMessage)}
        onClick={() => {
          onSend(trimmedMessage);
        }}
      >
        send
      </button>
    </div>
  );

  function isEmpty(message: string) {
    return message.length == 0;
  }
}
