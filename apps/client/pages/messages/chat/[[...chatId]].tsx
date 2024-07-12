import Image from 'next/image';
import { useEffect, useState } from 'react';
import { createDefaultHeader, Page } from '../../../components/page';
import { useRouter } from 'next/router';
import {
  MESSAGES_CHAT_ROUTE,
  MESSAGES_ROUTE,
} from '../../../utilities/constants';
import { useSelector } from 'react-redux';
import { selectSelectedUser } from '../../../lib/redux';
import { getOrCreateChat } from '../../../utilities/getOrCreateChat';
import { sendMessage } from '../../../utilities/sendMessage';

export default function Chat() {
  const router = useRouter();
  const user = useSelector(selectSelectedUser);
  const [message, setMessage] = useState('');
  const [messageInput, setMessageInput] = useState('');

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
              router.push(`${MESSAGES_CHAT_ROUTE}/${chat.id}`);
              await sendMessage(message, chat.id);
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
