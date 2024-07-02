import { useRouter } from 'next/router';
import { Page, createDefaultHeader } from '../components/page';
import { SearchBar } from '../components/searchBar';
import { Posts } from '../components/posts';
import { searchPosts } from '../lib/redux/slices/postsSlice/searchPosts';
import { Spinner } from '../components/spinner';
import { useEffect, useState } from 'react';
import { Error } from '../components/error';
import { Post } from '../lib/redux/slices/postsSlice/post';

export default function Search() {
  const LIMIT = 20;

  const [status, setStatus] = useState<
    'idle' | 'loading' | 'error' | 'success'
  >('idle');
  const [initialPosts, setInitialPosts] = useState<Post[]>();

  const router = useRouter();
  const { query, setQuery } = useQuery(router.query?.q as string);
  useSearch(query);

  return (
    <Page header={createDefaultHeader(renderSearchBar())}>
      {status === 'loading' && <Spinner />}
      {status === 'error' && <Error />}
      {status === 'success' && renderPosts()}
    </Page>
  );

  function useQuery(queryParam: string) {
    const [query, setQuery] = useState('');

    useEffect(() => {
      setQuery(queryParam as string);
    }, [queryParam]);

    return { query, setQuery };
  }

  function useSearch(query: string) {
    useEffect(() => {
      if (query) search(query);
    }, [query]);
  }

  function renderSearchBar() {
    return <SearchBar value={query} onSubmit={onSubmit} key={query} />;

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
