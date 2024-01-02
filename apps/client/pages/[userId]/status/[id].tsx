import { useRouter } from 'next/router';
import {
  fetchPostAsync,
  selectFetchStatus,
  selectFetchedPost,
  useDispatch,
  useSelector,
} from '../../../lib/redux';
import { useEffect } from 'react';

export function Status() {
  const dispatch = useDispatch();

  const fetchStatus = useSelector(selectFetchStatus);
  const fetchedPost = useSelector(selectFetchedPost);

  const router = useRouter();
  const id = router.query.id;

  useEffect(() => {
    if (id) dispatch(fetchPostAsync(id as string));
  }, [id, dispatch]);

  return (
    <div>
      <button aria-label="back" onClick={() => router.back()}>
        icon
      </button>
      <h1>Post</h1>
      {fetchedPost && (
        <div>
          <p>{fetchedPost.text}</p>
          <p>{formatDate(fetchedPost.createdAt)}</p>
        </div>
      )}
      {fetchStatus === 'failed' && 'Something went wrong'}
      {fetchStatus === 'loading' && 'loading'}
    </div>
  );

  function formatDate(date: Date): string {
    const options: Intl.DateTimeFormatOptions = {
      hour: 'numeric',
      minute: 'numeric',
      day: 'numeric',
      month: 'short',
      year: 'numeric',
    };

    return new Intl.DateTimeFormat('en-US', options).format(date);
  }
}
