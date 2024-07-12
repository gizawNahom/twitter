import Image from 'next/image';
import { useEffect, useState } from 'react';
import { createDefaultHeader, Page } from '../../components/page';
import { useRouter } from 'next/router';
import { MESSAGES_ROUTE } from '../../utilities/constants';
import { useSelector } from 'react-redux';
import { selectSelectedUser } from '../../lib/redux/';
import { getOrCreateChat } from '../../utilities/getOrCreateChat';
import { sendMessage } from '../../utilities/sendMessage';

export default function Chat() {
  const router = useRouter();
  const user = useSelector(selectSelectedUser);
  const [message, setMessage] = useState('');

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
        <p>{message}</p>
        {/* <p>
          {new Date().toLocaleTimeString('en-US', {
            hour: 'numeric',
            minute: 'numeric',
            hour12: true,
          })}
        </p> */}
        <MessageSendInput
          onSend={async (message) => {
            try {
              const chat = await getOrCreateChat(user?.username as string);
              setMessage(message);
              await sendMessage(message, chat.id);
            } catch (error) {
              setMessage('');
            }
          }}
        />
      </div>
    </Page>
  );
}

export function MessageSendInput({
  onSend,
}: {
  onSend: (message: string) => void;
}) {
  const [message, setMessage] = useState('');
  const trimmedMessage = message.trim();

  return (
    <div data-testid="message-send-input">
      <input
        type="text"
        placeholder="Start a new message"
        value={message}
        onChange={(e) => setMessage(e.target.value)}
      />
      <button
        aria-label="send"
        disabled={isEmpty(trimmedMessage)}
        onClick={() => {
          onSend(trimmedMessage);
          setMessage('');
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
