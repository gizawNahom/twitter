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
import { Infinite } from '../../../../components/infinite';
import { ActionItem } from '../../../../components/actionItem';

export default function Chat() {
  const [messageInput, setMessageInput] = useState('');

  const router = useRouter();
  const user = useSelector(selectSelectedUser);
  const { handleGetOrCreateChat } = useGetOrCreateChat();
  const { chatId, setChatId } = useChatGuard(router, user);
  const { messagesByDay, readMessages, hasMore } = useReadMessages(chatId);
  const { handleSendMessage } = useSendMessage();

  return (
    <Page1
      header={renderHeader()}
      isPadded={false}
      className=" z-[1000] bg-white h-screen w-full"
    >
      <>
        <div className="h-[94%]">
          {canRenderMessages(messagesByDay)
            ? renderMessages()
            : renderPlaceholder()}
        </div>
        <div className="px-3 py-2 border-t-[1px] fixed bottom-0 w-full z-[2000]">
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
    return (
      <div className=" h-full flex justify-center items-center">
        <p className=" px-2 py-1 bg-black/40 rounded-full text-white">
          No messages
        </p>
      </div>
    );
  }

  function renderMessages() {
    return (
      <div role="log" className=" h-full">
        <Infinite fetchMethod={readMessages} hasMore={hasMore}>
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
        </Infinite>
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
    <div
      data-testid="message-send-input"
      className=" w-full bg-slate-200 rounded-full flex justify-between px-4 py-2 gap-6"
    >
      <input
        type="text"
        placeholder="Start a new message"
        value={messageInput}
        onChange={(e) => onChange(e.target.value)}
        className=" bg-transparent placeholder:text-slate-600 outline-none grow"
      />
      <button
        aria-label="send"
        disabled={isEmpty(trimmedMessage)}
        onClick={() => {
          onSend(trimmedMessage);
        }}
      >
        <ActionItem>
          <svg
            viewBox="0 0 24 24"
            aria-hidden="true"
            className={` transition h-5 w-5 ${
              isEmpty(trimmedMessage) ? 'fill-sky-300' : 'fill-sky-500'
            }`}
          >
            <g>
              <path d="M2.504 21.866l.526-2.108C3.04 19.719 4 15.823 4 12s-.96-7.719-.97-7.757l-.527-2.109L22.236 12 2.504 21.866zM5.981 13c-.072 1.962-.34 3.833-.583 5.183L17.764 12 5.398 5.818c.242 1.349.51 3.221.583 5.183H10v2H5.981z"></path>
            </g>
          </svg>
        </ActionItem>
      </button>
    </div>
  );

  function isEmpty(message: string) {
    return message.length == 0;
  }
}
