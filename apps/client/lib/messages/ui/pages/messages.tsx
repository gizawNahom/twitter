import Link from 'next/link';
import { MESSAGES_COMPOSE_ROUTE, MESSAGES_ROUTE } from '../utilities/routes';
import { FAB } from '../../../../components/fab';
import { useEffect, useState } from 'react';
import Image from 'next/image';
import { Spinner } from '../../../../components/spinner';
import { Error } from '../../../../components/error';
import { useRouter } from 'next/router';
import InfiniteScroll from 'react-infinite-scroller';
import { Chat } from '../../core/domain/chat';
import { useGetChats } from '../hooks/useGetChats';
import { ActionItem } from '../../../../components/actionItem';
import Ch from './chat';

export default function Messages({ chatId }: { chatId: string | undefined }) {
  const router = useRouter();
  const [offset, setOffset] = useState(0);
  const [isLoadingFirstPage, setIsLoadingFirstPage] = useState(true);
  const { handleGetChats, chats, isLoading, isFinished, isError } =
    useGetChats();

  useFetchChatsOnMount();

  return (
    <div className=" w-full relative sm:max-w-xl sm:h-screen lg:flex lg:max-w-5xl">
      <div className="w-full sm:grow sm:max-w-xl sm:border-r-[1px] lg:max-w-[390px] lg:min-w-[300px]">
        <div className={`flex flex-col gap-y-2 pt-4 relative`}>
          <div className="px-4 flex justify-between">
            <h2 className="text-center font-bold text-xl">Messages</h2>
            <Link href={MESSAGES_COMPOSE_ROUTE} className="hidden sm:block">
              <ActionItem>
                <svg
                  viewBox="0 0 24 24"
                  aria-hidden="true"
                  className=" w-5 h-5"
                >
                  <g>
                    <path d="M1.998 5.5c0-1.381 1.119-2.5 2.5-2.5h15c1.381 0 2.5 1.119 2.5 2.5V12h-2v-1.537l-8 3.635-8-3.635V18.5c0 .276.224.5.5.5H13v2H4.498c-1.381 0-2.5-1.119-2.5-2.5v-13zm2 2.766l8 3.635 8-3.635V5.5c0-.276-.224-.5-.5-.5h-15c-.276 0-.5.224-.5.5v2.766zM19 18v-3h2v3h3v2h-3v3h-2v-3h-3v-2h3z"></path>
                  </g>
                </svg>
              </ActionItem>
            </Link>
          </div>
          <div>
            {isLoadingFirstPage && <Spinner />}
            {canRenderPlaceholders() && renderPlaceholders()}
            {canRenderInfiniteScroll() && renderInfiniteScroll()}
            {isError && <Error />}
            <div className="fixed bottom-24 right-5 sm:static sm:hidden">
              <ComposeMessageFAB />
            </div>
          </div>
        </div>
      </div>
      <div className="md:border-r-[1px] lg:max-w-[600px] lg:min-w-[500px]">
        {chatId ? (
          <div className="h-screen w-full z-[1000] fixed left-0 top-0 lg:static">
            <Ch chatId={chatId} />
          </div>
        ) : (
          <div className="hidden h-screen lg:justify-center lg:items-center lg:flex">
            <div className=" w-96">
              <h1 className=" text-3xl font-bold">Select a message</h1>
              <p className=" text-slate-500 mt-1">
                Choose from your existing conversations, start a new one, or
                just keep swimming.
              </p>
              <Link
                href="/messages/compose"
                className=" bg-sky-500 hover:bg-sky-600 transition rounded-full text-white py-3 px-8 text-lg mt-7 inline-block"
              >
                New message
              </Link>
            </div>
          </div>
        )}
      </div>
    </div>
  );

  function useFetchChatsOnMount() {
    useEffect(() => {
      (async () => {
        await fetchChats();
        setIsLoadingFirstPage(false);
      })();
      // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);
  }

  function canRenderPlaceholders() {
    return !isLoadingFirstPage && chats.length == 0 && !isError;
  }

  function renderPlaceholders() {
    return (
      <>
        <h1>Welcome to your inbox!</h1>
        <Link href={MESSAGES_COMPOSE_ROUTE}>Write a message</Link>
      </>
    );
  }

  function canRenderInfiniteScroll() {
    return !isLoadingFirstPage && chats.length != 0;
  }

  function renderInfiniteScroll() {
    return (
      <InfiniteScroll
        pageStart={1}
        loadMore={fetchChats}
        hasMore={!isError && !isFinished}
        loader={<Spinner key="loader" />}
      >
        {renderChats()}
      </InfiniteScroll>
    );
  }

  async function fetchChats() {
    if (!isLoading) {
      await handleGetChats(offset);
      setOffset(offset + 1);
    }
  }

  function renderChats() {
    return (
      <>
        {chats.map((chat: Chat) => {
          const path = `${MESSAGES_ROUTE}/${chat.id}`;
          return (
            <Link
              key={chat.id}
              href={path}
              className={`flex gap-2 px-4 py-3 justify-start hover:bg-slate-100 relative${
                router.asPath === path &&
                ' bg-slate-100 after:w-1 after:h-full after:absolute after:right-0 after:top-0 after:bg-sky-500'
              }`}
            >
              <div className=" rounded-full">
                <Image
                  src={chat.participant.profilePic}
                  alt={`${chat.participant.displayName}'s profile pic`}
                  width={100}
                  height={100}
                  className="rounded-full object-cover w-10 h-10"
                />
              </div>
              <div className="text-sm flex gap-1">
                <p className="font-semibold">{chat.participant.displayName} </p>
                <span className="text-slate-500">
                  @{chat.participant.username}
                </span>
              </div>
            </Link>
          );
        })}
      </>
    );
  }
}

export function ComposeMessageFAB() {
  return (
    <Link
      data-testid="compose-message-FAB"
      href={MESSAGES_COMPOSE_ROUTE}
      aria-label="Compose Message"
    >
      <FAB>
        <svg
          viewBox="0 0 24 24"
          aria-hidden="true"
          className=" w-6 h-6 stroke-white fill-white stroke-0"
        >
          <g>
            <path d="M1.998 5.5c0-1.381 1.119-2.5 2.5-2.5h15c1.381 0 2.5 1.119 2.5 2.5V12h-2v-1.537l-8 3.635-8-3.635V18.5c0 .276.224.5.5.5H13v2H4.498c-1.381 0-2.5-1.119-2.5-2.5v-13zm2 2.766l8 3.635 8-3.635V5.5c0-.276-.224-.5-.5-.5h-15c-.276 0-.5.224-.5.5v2.766zM19 18v-3h2v3h3v2h-3v3h-2v-3h-3v-2h3z"></path>
          </g>
        </svg>
      </FAB>
    </Link>
  );
}
