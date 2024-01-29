import { useEffect, useState } from 'react';
import { fetchPosts } from '../lib/redux/slices/postsSlice/fetchPosts';
import { Error } from './error';

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
      {status === 'loading' && (
        <div
          className={
            'border-cyan-500 align-middle inline-block h-5 w-5 animate-spin rounded-full border-[3px] border-solid border-current border-r-transparent motion-reduce:animate-[spin_1.5s_linear_infinite]'
          }
          role="status"
        >
          <span className="!absolute !-m-px !h-px !w-px !overflow-hidden !whitespace-nowrap !border-0 !p-0 ![clip:rect(0,0,0,0)]">
            Loading...
          </span>
        </div>
      )}
      {status === 'error' && <Error />}
    </div>
  );
}
