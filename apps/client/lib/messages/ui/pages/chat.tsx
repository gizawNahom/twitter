import Image from 'next/image';
import { useEffect, useState } from 'react';
import { createDefaultHeader1, Page1 } from '../../../../components/page';
import { useRouter } from 'next/router';
import { MESSAGES_CHAT_ROUTE, MESSAGES_ROUTE } from '../utilities/routes';
import { formatTimeForMessage } from '../utilities';
import { useGetOrCreateChat } from '../hooks/useGetOrCreateChat';
import { PartialChat } from '../../core/domain/partialChat';
import { useSendMessage } from '../hooks/useSendMessage';
import { Message as Msg } from '../../core/domain/message';
import { MessagesByDay, useReadMessages } from '../hooks/useReadMessages';
import { Infinite } from '../../../../components/infinite';
import { ActionItem } from '../../../../components/actionItem';
import { useGetParticipant } from '../hooks/useGetParticipant';

export default function Chat() {
  const [messageInput, setMessageInput] = useState('');

  const { participant, chatId, setChatId } = useChatGuard();
  const { handleGetOrCreateChat } = useGetOrCreateChat();
  const { messagesByDay, readMessages, hasMore } = useReadMessages(chatId);
  const { handleSendMessage } = useSendMessage();

  return (
    <Page1
      header={renderHeader()}
      isPadded={false}
      className=" z-[1000] bg-white h-screen w-full lg:border-r-[1px]"
    >
      <div className=" relative h-full">
        <div className="h-[94%]">
          {canRenderMessages(messagesByDay)
            ? renderMessages()
            : renderPlaceholder()}
        </div>
        <div className="px-3 py-2 border-t-[1px] absolute bottom-0 w-full z-[2000]">
          <MessageSendInput
            onSend={sendMessage}
            messageInput={messageInput}
            onChange={setMessageInput}
          />
        </div>
      </div>
    </Page1>
  );

  function useChatGuard() {
    const router = useRouter();
    const [chatId, setChatId] = useState<string | undefined>();
    const { participant } = useGetParticipant(chatId);

    useEffect(() => {
      if (router.isReady) {
        if (!participant && !getChatId1()) {
          router.push(MESSAGES_ROUTE);
        } else if (!chatId) setChatId(getChatId(router.query?.chatId));
      }
    }, [router, participant, chatId]);

    return { participant, chatId, setChatId };

    function getChatId(
      chatId: string[] | string | undefined
    ): string | undefined {
      return Array.isArray(chatId) ? chatId[0] : chatId;
    }

    function getChatId1(): string | undefined {
      const pathSegments = window.location.pathname.split('/');
      return pathSegments[pathSegments.length - 1];
    }
  }

  function renderHeader() {
    return createDefaultHeader1(
      <div>
        {participant && (
          <div className=" flex gap-3 items-center">
            <div className="w-10 h-10 relative rounded-full overflow-hidden">
              <Image
                src={participant.profilePic}
                alt={`${participant.username}'s profile picture`}
                fill
                className="object-cover"
              />
            </div>
            <p className=" text-xl font-semibold">{participant.displayName}</p>
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
              <div key={day} className=" flex flex-col gap-3 pt-3 px-3">
                <div className="flex justify-center">
                  <h3 className=" text-center w-fit px-3 py-1 bg-black/20 text-white rounded-full text-sm">
                    {day}
                  </h3>
                </div>
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
        participant?.username as string
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
    <div data-testid="message" className=" flex flex-col items-end gap-2">
      <p className=" bg-sky-500 py-2 px-3 w-fit text-white rounded-tl-full rounded-tr-full rounded-bl-full rounded-br-md">
        {message.text}
      </p>
      <div className=" flex text-slate-500 text-xs gap-1">
        <p>{formatTimeForMessage(new Date(message.createdAt))}</p>
        <span className="-mt-1 block">.</span>
        {renderStatus(message.isLoading)}
      </div>
    </div>
  );

  function renderStatus(isLoading: boolean | undefined) {
    if (isLoading) return <MessageSpinner />;
    else return <div aria-label="sent">Sent</div>;
  }
}

function MessageSpinner() {
  return (
    <div
      data-testid="spinner"
      className={
        'border-cyan-500 align-middle inline-block h-3 w-3 animate-spin rounded-full border-[2px] border-solid border-current border-r-transparent motion-reduce:animate-[spin_1.5s_linear_infinite]'
      }
      role="status"
    >
      <span className="!absolute !-m-px !h-px !w-px !overflow-hidden !whitespace-nowrap !border-0 !p-0 ![clip:rect(0,0,0,0)]">
        Loading...
      </span>
    </div>
  );
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
