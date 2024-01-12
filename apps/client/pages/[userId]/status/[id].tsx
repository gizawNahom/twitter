import { useRouter } from 'next/router';
import {
  fetchPostAsync,
  selectFetchStatus,
  selectFetchedPost,
  useDispatch,
  useSelector,
} from '../../../lib/redux';
import { ReactNode, useEffect } from 'react';
import { BackButton } from '../../../components/backButton';

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
    <div className="px-4">
      <div className="flex justify-between gap-x-8 items-center pt-2">
        <BackButton />
        <h1 className="grow text-xl font-medium">Post</h1>
      </div>
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
        </Container>
      )}
      {fetchStatus === 'failed' && (
        <Container>
          <p className="text-slate-500">Something went wrong</p>
        </Container>
      )}
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

  function Container({ children }: { children: ReactNode }) {
    return (
      <div className="min-h-[150px] flex justify-center items-center">
        {children}
      </div>
    );
  }
}
