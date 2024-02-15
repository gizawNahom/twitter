import { ReactNode, useEffect, useState } from 'react';
import { fetchPosts } from '../lib/redux/slices/postsSlice/fetchPosts';
import { Error } from './error';
import { Spinner } from './spinner';
import { Post } from '../lib/redux/slices/postsSlice/post';
import { Avatar } from './avatar';

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
        posts.map((p) => {
          return createPost(p);
        })}
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
