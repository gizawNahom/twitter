import { useRouter } from 'next/router';
import {
  fetchPostAsync,
  selectFetchStatus,
  selectFetchedPost,
  useDispatch,
  useSelector,
} from '../../../lib/redux';
import { ReactNode, useEffect } from 'react';
import { Page } from '../../../components/page';
import { Error } from '../../../components/error';
import { Spinner } from 'apps/client/components/spinner';

export default function Status() {
  const dispatch = useDispatch();

  const fetchStatus = useSelector(selectFetchStatus);
  const fetchedPost = useSelector(selectFetchedPost);

  const router = useRouter();
  const id = router.query.id;

  useEffect(() => {
    if (id) dispatch(fetchPostAsync(id as string));
  }, [id, dispatch]);

  return (
    <Page title={<h1 className="grow text-xl font-medium">Post</h1>}>
      {fetchedPost && (
        <article className="h-min flex flex-col gap-y-3 pt-3">
          <header className="flex gap-3 items-center">
            <div className="bg-slate-300 h-10 w-10 rounded-full border "></div>
            <div>
              <p className="font-bold text-lg">John Doe</p>
              <p className="text-slate-500 -mt-1">@john</p>
            </div>
          </header>
          <p>{fetchedPost.text}</p>
          <time className="text-slate-500 text-sm">
            {formatDate(fetchedPost.createdAt)}
          </time>
        </article>
      )}
      {fetchStatus === 'loading' && (
        <Container>
          <Spinner />
        </Container>
      )}
      {fetchStatus === 'failed' && (
        <Container>
          <Error />
        </Container>
      )}
    </Page>
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

  function Container({ children }: { children: ReactNode }) {
    return (
      <div className="min-h-[150px] flex justify-center items-center">
        {children}
      </div>
    );
  }
}
