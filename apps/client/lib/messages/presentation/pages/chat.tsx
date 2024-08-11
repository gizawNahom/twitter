import Image from 'next/image';
import { useEffect, useState } from 'react';
import { createDefaultHeader, Page } from '../../../../components/page';
import { useRouter } from 'next/router';
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

export default function Chat() {
  const router = useRouter();
  const user = useSelector(selectSelectedUser);
  const [messageInput, setMessageInput] = useState('');
  const { handleGetOrCreateChat, chat } = useGetOrCreateChat();
  const [previousMessages, setPreviousMessageGroups] = useState<
    Map<string, Msg[]>
  >(new Map());
  const [messages, setMessages] = useState<string[]>([]);

  useEffect(() => {
    if (router.isReady) {
      if (!user && !router.query?.chatId) router.push(MESSAGES_ROUTE);
    }
  }, [router, user]);

  useEffect(() => {
    (async () => {
      const chatId = router?.query?.chatId;
      if (chatId) {
        try {
          const messages = await readMessages(chatId as string, 0, 3);
          setPreviousMessageGroups(buildPreviousMessages(messages));
        } catch (error) {
          //
        }
      }
    })();
  }, [router]);

  return (
    <Page
      header={createDefaultHeader(
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
      )}
    >
      <div>
        {messages.length === 0 && previousMessages.size == 0 && (
          <p>No messages</p>
        )}
        {(previousMessages.size > 0 || chat) && (
          <div role="log">
            {Array.from(previousMessages.entries()).map(([day, messages]) => {
              return (
                <div key={day}>
                  <h3>{day}</h3>
                  {messages.map((message) => (
                    <Message
                      key={message.id}
                      message={message}
                      chatId={chat?.id as string}
                      isToBeSent={false}
                    />
                  ))}
                </div>
              );
            })}

            {messages.length != 0 && (
              <>
                {formatDayForMessage(new Date())}

                {messages.map((message, i) => {
                  return (
                    <Message
                      key={i}
                      message={{
                        text: message,
                        createdAt: new Date().toISOString(),
                      }}
                      chatId={chat?.id as string}
                      isToBeSent
                    />
                  );
                })}
              </>
            )}
          </div>
        )}
        <MessageSendInput
          onSend={async (message) => {
            if (!chat) {
              const c = (await handleGetOrCreateChat(
                user?.username as string
              )) as PartialChat;
              if (c) {
                setMessages([...messages, message]);
                window.history.replaceState(
                  null,
                  '',
                  `${MESSAGES_CHAT_ROUTE}/${c.id}`
                );
                setMessageInput('');
              }
            } else {
              setMessages([...messages, message]);
            }
          }}
          messageInput={messageInput}
          setMessageInput={setMessageInput}
        />
      </div>
    </Page>
  );

  function buildPreviousMessages(messages: Msg[]) {
    const prevMsgs = new Map<string, Msg[]>();
    messages.forEach((m) => {
      const day = formatDayForMessage(new Date(m.createdAt));
      if (prevMsgs.has(day)) prevMsgs.get(day)?.push(m);
      else prevMsgs.set(day, [m]);
    });
    return prevMsgs;
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
  setMessageInput,
}: {
  onSend: (message: string) => void;
  messageInput: string;
  setMessageInput: (messageInput: string) => void;
}) {
  const trimmedMessage = messageInput.trim();

  return (
    <div data-testid="message-send-input">
      <input
        type="text"
        placeholder="Start a new message"
        value={messageInput}
        onChange={(e) => setMessageInput(e.target.value)}
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
