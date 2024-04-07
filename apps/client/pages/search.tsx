import { useRouter } from 'next/router';
import { Page } from '../components/page';
import { SearchInput } from '../components/searchInput';
import { Posts } from '../components/posts';
import { searchPosts } from '../lib/redux/slices/postsSlice/searchPosts';
import { Spinner } from '../components/spinner';
import { useEffect, useState } from 'react';
import { Error } from '../components/error';
import { Post } from '../lib/redux/slices/postsSlice/post';

export default function Search() {
  const LIMIT = 20;
  const router = useRouter();

  const [status, setStatus] = useState<
    'idle' | 'loading' | 'error' | 'success'
  >('idle');
  const [initialPosts, setInitialPosts] = useState<Post[]>();
  const [query, setQuery] = useState(router.query?.q as string);

  useSearchOnMount(query);

  return (
    <Page title={renderSearchInput()}>
      {status === 'loading' && <Spinner />}
      {status === 'error' && <Error />}
      {status === 'success' && renderPosts()}
    </Page>
  );

  function useSearchOnMount(query: string) {
    useEffect(() => {
      if (query) search(query);
      // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);
  }

  function renderSearchInput() {
    return <SearchInput value={query} onSubmit={onSubmit} />;

    async function onSubmit(query: string) {
      setQuery(query);
      router.push(`/search?q=${query}`);
      await search(query);
    }
  }

  async function search(query: string) {
    try {
      await trySearch();
    } catch (error) {
      setStatus('error');
    }

    async function trySearch() {
      const firstPageOffset = 0;
      setStatus('loading');
      setInitialPosts(await getResults(query, firstPageOffset));
      setStatus('success');
    }
  }

  function renderPosts() {
    return (
      <Posts
        fetchPosts={async (offset) => await getResults(query, offset)}
        firstPagePosts={initialPosts}
      />
    );
  }

  async function getResults(query: string, offset: number) {
    return await searchPosts(query, offset, LIMIT);
  }
}
