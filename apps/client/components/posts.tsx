import { useEffect, useState } from 'react';
import { fetchPosts } from '../lib/redux/slices/postsSlice/fetchPosts';
import { Error } from './error';
import { Spinner } from './spinner';

export function Posts() {
  const [status, setStatus] = useState('loading');

  useEffect(() => {
    (async () => {
      try {
        await fetchPosts('', 0, 0);
      } catch (e) {
        setStatus('error');
      }
    })();
  }, []);

  return (
    <div>
      {status === 'loading' && <Spinner />}
      {status === 'error' && <Error />}
    </div>
  );
}
