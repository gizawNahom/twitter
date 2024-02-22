import { useCallback, useEffect, useState } from 'react';
import { fetchPosts } from '../lib/redux/slices/postsSlice/fetchPosts';
import { Error } from './error';
import { Spinner } from './spinner';
import { Post } from '../lib/redux/slices/postsSlice/post';
import { Avatar } from './avatar';
import InfiniteScroll from 'react-infinite-scroller';

export function Posts({ userId }: { userId: string }) {
  const [hasMore, setHasMore] = useState(true);
  const [offset, setOffset] = useState(0);
  const [posts, setPosts] = useState<Array<Post>>([]);
  const [status, setStatus] = useState<'idle' | 'fetching' | 'error'>('idle');

  const fetchItems = useCallback(async () => {
    try {
      if (status === 'fetching') return;
      setStatus('fetching');
      const fetchedPosts = await fetchPosts(userId, offset, 20);
      if (fetchPosts.length === 0) setHasMore(false);
      setOffset(offset + 1);
      setPosts([...posts, ...fetchedPosts]);
      setStatus('idle');
    } catch (e) {
      setStatus('error');
      setHasMore(false);
    }
  }, [offset, posts, status, userId]);

  useEffect(() => {
    fetchItems();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const loader = <Spinner key="loader" />;

  return (
    <div data-testid="posts">
      <InfiniteScroll loadMore={fetchItems} hasMore={hasMore} loader={loader}>
        {posts.map((post, i) => createPost(post))}
      </InfiniteScroll>
      {status === 'error' && (
        <div className="flex justify-center items-center h-16 w-full">
          <Error />
        </div>
      )}
    </div>
  );

  function createPost(p: Post) {
    return (
      <div key={p.id} className="border-b-[1px] flex gap-2 p-2">
        <Avatar />
        <div className="grow">
          <div className="flex gap-1">
            <p className="font-bold">John Doe</p>
            <div className="text-slate-500 flex text-sm">
              <p>@john</p>
              <div className="flex justify-center items-center h-3 px-1">
                <p>.</p>
              </div>
              <p>{formatDate(p.createdAt)}</p>
            </div>
          </div>
          <p>{p.text}</p>
        </div>
      </div>
    );
  }

  function formatDate(date: Date): string {
    const options: Intl.DateTimeFormatOptions = {
      day: 'numeric',
      month: 'short',
      year: 'numeric',
    };

    return new Intl.DateTimeFormat('en-US', options).format(date);
  }
}
