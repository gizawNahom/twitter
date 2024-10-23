import Link from 'next/link';
import { Page } from '../../../../components/page';
import {
  MESSAGES_CHAT_ROUTE,
  MESSAGES_COMPOSE_ROUTE,
} from '../utilities/routes';
import { FAB } from '../../../../components/fab';
import { useEffect, useState } from 'react';
import Image from 'next/image';
import { Spinner } from '../../../../components/spinner';
import { Error } from '../../../../components/error';
import { useRouter } from 'next/router';
import InfiniteScroll from 'react-infinite-scroller';
import { Chat } from '../../core/domain/chat';
import { useGetChats } from '../hooks/useGetChats';

export default function Messages() {
  const router = useRouter();
  const [offset, setOffset] = useState(0);
  const [isLoadingFirstPage, setIsLoadingFirstPage] = useState(true);
  const { handleGetChats, chats, isLoading, isFinished, isError } =
    useGetChats();

  useFetchChatsOnMount();

  return (
    <Page header={<h2 className="text-center">Messages</h2>}>
      {isLoadingFirstPage && <Spinner />}
      {canRenderPlaceholders() && renderPlaceholders()}
      {canRenderInfiniteScroll() && renderInfiniteScroll()}
      {isError && <Error />}
      <div className="fixed bottom-24 right-5 sm:static xl:hidden">
        <ComposeMessageFAB />
      </div>
    </Page>
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
          return (
            <div
              key={chat.id}
              onClick={() => router.push(`${MESSAGES_CHAT_ROUTE}/${chat.id}`)}
            >
              <p>{chat.participant.displayName}</p>
              <Image
                src={chat.participant.profilePic}
                alt={`${chat.participant.displayName}'s profile pic`}
                width={100}
                height={100}
              />
            </div>
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