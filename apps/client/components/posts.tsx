import { useEffect, useState } from 'react';
import InfiniteScroll from 'react-infinite-scroller';
import { Error } from './error';
import { Spinner } from './spinner';
import { Post } from '../lib/redux/slices/postsSlice/post';
import { Avatar } from './avatar';
import { createWhenText } from '../utilities/createWhenText';

export function Posts({
  fetchPosts,
  firstPagePosts = [],
}: {
  fetchPosts: (offset: number) => Promise<Array<Post>>;
  firstPagePosts?: Post[];
}) {
  const [hasMore, setHasMore] = useState(true);
  const [offset, setOffset] = useState(setInitialOffset(firstPagePosts));
  const [posts, setPosts] = useState<Array<Post>>(
    setInitialPosts(firstPagePosts)
  );
  const [status, setStatus] = useState<'idle' | 'fetching' | 'error'>('idle');

  useFetchItemsOnMount();

  return (
    <div data-testid="posts">
      {renderInfiniteScroll()}
      {status === 'error' && renderError()}
    </div>
  );

  function setInitialOffset(firstPagePosts: Post[]): number {
    return firstPagePosts == null || firstPagePosts.length == 0 ? 0 : 1;
  }

  function setInitialPosts(firstPagePosts: Post[]): Post[] {
    return firstPagePosts || [];
  }

  function useFetchItemsOnMount() {
    useEffect(() => {
      fetchItems();
      // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);
  }

  function renderInfiniteScroll() {
    return (
      <InfiniteScroll
        loadMore={fetchItems}
        hasMore={hasMore}
        loader={<Spinner key="loader" />}
      >
        {renderPosts()}
      </InfiniteScroll>
    );

    function renderPosts() {
      return posts.map((post, i) => createPost(post, i));
    }

    function createPost(p: Post, key: number) {
      return (
        <div key={key} className="border-b-[1px] flex gap-2 p-2">
          <Avatar />
          <div className="grow">
            <div className="flex gap-1">
              <p className="font-bold">John Doe</p>
              <div className="text-slate-500 flex text-sm">
                <p>@john</p>
                <div className="flex justify-center items-center h-3 px-1">
                  <p>.</p>
                </div>
                <p>{createWhenText(p.createdAt)}</p>
              </div>
            </div>
            <p>{p.text}</p>
          </div>
        </div>
      );
    }
  }

  async function fetchItems() {
    try {
      await tryFetchItems();
    } catch (e) {
      setStatus('error');
      setHasMore(false);
    }

    async function tryFetchItems() {
      if (status !== 'fetching') {
        setStatus('fetching');
        const fetchedPosts = await fetchPosts(offset);
        if (fetchedPosts.length === 0) setHasMore(false);
        setOffset(offset + 1);
        setPosts([...posts, ...fetchedPosts]);
        setStatus('idle');
      }
    }
  }

  function renderError() {
    return (
      <div className="flex justify-center items-center h-16 w-full">
        <Error />
      </div>
    );
  }
}
