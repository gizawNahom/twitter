import Image from 'next/image';
import { useEffect, useState } from 'react';
import { createDefaultHeader, Page } from '../../../../components/page';
import { useRouter } from 'next/router';
import { MESSAGES_CHAT_ROUTE, MESSAGES_ROUTE } from '../utilities/routes';
import { useSelector } from 'react-redux';
import { selectSelectedUser } from '../../../redux';
import { sendMessage } from '../../adapters/api/sendMessage';
import { formatTimeForMessage, formatDayForMessage } from '../utilities';
import { Spinner } from '../../../../components/spinner';
import { useGetOrCreateChat } from '../../adapters/hooks/useGetOrCreateChat';
import { PartialChat } from '../../core/domain/partialChat';

export default function Chat() {
  const router = useRouter();
  const user = useSelector(selectSelectedUser);
  const [message, setMessage] = useState('');
  const [messageInput, setMessageInput] = useState('');
  const [status, setStatus] = useState<'loading' | 'success'>();
  const { handleGetOrCreateChat, chat, error } = useGetOrCreateChat();

  useEffect(() => {
    if (!user) router.push(MESSAGES_ROUTE);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    if (error) {
      setMessage('');
      setMessageInput(message);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [error]);

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
        {!message && <p>No messages</p>}
        {chat && (
          <div role="log">
            {formatDayForMessage(new Date())}

            <div data-testid="message">
              <p>{message}</p>
              <p>{formatTimeForMessage(new Date())}</p>
              {status === 'loading' && <Spinner />}
              {status === 'success' && <div aria-label="sent"></div>}
            </div>
          </div>
        )}
        <MessageSendInput
          onSend={async (message) => {
            const chat = (await handleGetOrCreateChat(
              user?.username as string
            )) as PartialChat;
            if (chat) {
              setMessage(message);
              window.history.replaceState(
                null,
                '',
                `${MESSAGES_CHAT_ROUTE}/${chat.id}`
              );
              setMessageInput('');
              setStatus('loading');
              await sendMessage(message, chat.id);
              setStatus('success');
            }
          }}
          messageInput={messageInput}
          setMessageInput={setMessageInput}
        />
      </div>
    </Page>
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
