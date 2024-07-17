import Image from 'next/image';
import { useEffect, useState } from 'react';
import { createDefaultHeader, Page } from '../../../../components/page';
import { useRouter } from 'next/router';
import { MESSAGES_CHAT_ROUTE, MESSAGES_ROUTE } from '../../routes';
import { useSelector } from 'react-redux';
import { selectSelectedUser } from '../../../redux';
import { getOrCreateChat } from '../../getOrCreateChat';
import { sendMessage } from '../../sendMessage';
import { formatTimeForMessage } from '../../formatTimeForMessage';
import { formatDayForMessage } from '../../formatDayForMessage';
import { Spinner } from '../../../../components/spinner';

export default function Chat() {
  const router = useRouter();
  const user = useSelector(selectSelectedUser);
  const [message, setMessage] = useState('');
  const [messageInput, setMessageInput] = useState('');
  const [status, setStatus] = useState<'loading' | 'success'>();

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
        {!message && <p>No messages</p>}
        {message && (
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
            try {
              const chat = await getOrCreateChat(user?.username as string);
              setMessage(message);
              setStatus('loading');
              window.history.replaceState(
                null,
                '',
                `${MESSAGES_CHAT_ROUTE}/${chat.id}`
              );
              await sendMessage(message, chat.id);
              setStatus('success');
            } catch (error) {
              setMessage('');
              setMessageInput(message);
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
          setMessageInput('');
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
