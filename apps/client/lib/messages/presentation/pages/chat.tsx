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

export default function Chat() {
  const router = useRouter();
  const user = useSelector(selectSelectedUser);
  const [messageInput, setMessageInput] = useState('');
  const { handleGetOrCreateChat, chat } = useGetOrCreateChat();
  const [messages, setMessages] = useState<string[]>([]);

  useEffect(() => {
    if (!user) router.push(MESSAGES_ROUTE);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

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
        {messages.length === 0 && <p>No messages</p>}
        {chat && (
          <div role="log">
            {formatDayForMessage(new Date())}

            {messages.map((message, i) => {
              return <Message key={i} messageText={message} chatId={chat.id} />;
            })}
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
            }
          }}
          messageInput={messageInput}
          setMessageInput={setMessageInput}
        />
      </div>
    </Page>
  );
}

function Message({
  messageText,
  chatId,
}: {
  messageText: string;
  chatId: string;
}) {
  const { handleSendMessage, isLoading, message } = useSendMessage();

  useEffect(() => {
    (async () => await handleSendMessage(messageText, chatId))();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <div data-testid="message">
      <p>{messageText}</p>
      <p>{formatTimeForMessage(new Date())}</p>
      {isLoading && <Spinner />}
      {message && <div aria-label="sent"></div>}
    </div>
  );
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
