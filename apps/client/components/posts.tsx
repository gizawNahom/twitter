import { useEffect, useState } from 'react';
import { fetchPosts } from '../lib/redux/slices/postsSlice/fetchPosts';
import { Error } from './error';
import { Spinner } from './spinner';
import { Post } from '../lib/redux/slices/postsSlice/post';

export function Posts({ userId }: { userId: string }) {
  const [status, setStatus] = useState('loading');
  const [posts, setPosts] = useState<Array<Post>>([]);

  useEffect(() => {
    (async () => {
      try {
        setPosts(await fetchPosts(userId, 0, 20));
        setStatus('success');
      } catch (e) {
        setStatus('error');
      }
    })();
  }, [userId]);

  return (
    <div data-testid="posts">
      {status === 'loading' && <Spinner />}
      {status === 'error' && <Error />}
      {status === 'success' &&
        posts.map((e) => {
          return (
            <div key={e.id}>
              <p>{e.text}</p>
              <p>{formatDate(e.createdAt)}</p>
            </div>
          );
        })}
    </div>
  );

  function formatDate(date: Date): string {
    const options: Intl.DateTimeFormatOptions = {
      day: 'numeric',
      month: 'short',
      year: 'numeric',
    };

    return new Intl.DateTimeFormat('en-US', options).format(date);
  }
}
