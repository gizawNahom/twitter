import Image from 'next/image';
import { useEffect, useState } from 'react';
import { createDefaultHeader1, Page1 } from '../../../../components/page';
import { NextRouter, useRouter } from 'next/router';
import { MESSAGES_CHAT_ROUTE, MESSAGES_ROUTE } from '../utilities/routes';
import { useSelector } from 'react-redux';
import { selectSelectedUser } from '../../../redux';
import { formatTimeForMessage } from '../utilities';
import { Spinner } from '../../../../components/spinner';
import { useGetOrCreateChat } from '../hooks/useGetOrCreateChat';
import { PartialChat } from '../../core/domain/partialChat';
import { useSendMessage } from '../hooks/useSendMessage';
import { Message as Msg } from '../../core/domain/message';
import { User } from '../../../../utilities/getUsers';
import { MessagesByDay, useReadMessages } from '../hooks/useReadMessages';
import InfiniteScroll from 'react-infinite-scroller';

export default function Chat() {
  const [messageInput, setMessageInput] = useState('');

  const router = useRouter();
  const user = useSelector(selectSelectedUser);
  const { handleGetOrCreateChat } = useGetOrCreateChat();
  const { chatId, setChatId } = useChatGuard(router, user);
  const { messagesByDay, readMessages, hasMore } = useReadMessages(chatId);
  const { handleSendMessage } = useSendMessage();

  return (
    <Page1 header={renderHeader()} isPadded={false}>
      <>
        <div className="h-[94%] overflow-y-auto max-h-[94%]">
          {canRenderMessages(messagesByDay)
            ? renderMessages()
            : renderPlaceholder()}
        </div>
        <div className="h-[6%]">
          <MessageSendInput
            onSend={sendMessage}
            messageInput={messageInput}
            onChange={setMessageInput}
          />
        </div>
      </>
    </Page1>
  );

  function useChatGuard(router: NextRouter, user: User | null) {
    const [chatId, setChatId] = useState<string | undefined>();

    useEffect(() => {
      if (router.isReady) {
        if (!user && !getChatId(router.query?.chatId))
          router.push(MESSAGES_ROUTE);
        else if (!chatId) setChatId(getChatId(router.query?.chatId));
      }
    }, [router, user, chatId]);

    return { chatId, setChatId };

    function getChatId(
      chatId: string[] | string | undefined
    ): string | undefined {
      return Array.isArray(chatId) ? chatId[0] : chatId;
    }
  }

  function renderHeader() {
    return createDefaultHeader1(
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

  function canRenderMessages(messagesByDay: MessagesByDay) {
    return messagesByDay.size > 0;
  }

  function renderPlaceholder() {
    return <p>No messages</p>;
  }

  function renderMessages() {
    return (
      <div role="log">
        <InfiniteScroll
          loadMore={readMessages}
          hasMore={hasMore}
          loader={<Spinner key="loader" />}
          isReverse={true}
        >
          {Array.from(messagesByDay.entries()).map(([day, messages], index) => {
            return (
              <div key={day}>
                <h3>{day}</h3>
                {messages.map((message) => {
                  return <Message key={message.id} message={message} />;
                })}
              </div>
            );
          })}
        </InfiniteScroll>
      </div>
    );
  }

  async function sendMessage(text: string) {
    if (!chatId) {
      const chat = (await handleGetOrCreateChat(
        user?.username as string
      )) as PartialChat;
      if (chat) {
        window.history.replaceState(
          null,
          '',
          `${MESSAGES_CHAT_ROUTE}/${chat.id}`
        );
        setChatId(chat.id);
        send(text, chat.id);
      }
    } else send(text, chatId as string);

    function send(text: string, chatId: string) {
      setMessageInput('');
      handleSendMessage(text, chatId);
    }
  }
}

function Message({ message }: { message: Msg }) {
  return (
    <div data-testid="message">
      <p>{message.text}</p>
      <p>{formatTimeForMessage(new Date(message.createdAt))}</p>
      {renderStatus(message.isLoading)}
    </div>
  );

  function renderStatus(isLoading: boolean | undefined) {
    if (isLoading) return <Spinner />;
    else return <div aria-label="sent"></div>;
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
