import { ReactNode } from 'react';
import { Nav } from './nav';
import { SearchInput } from './searchInput';
import { useRouter } from 'next/router';

export function App({ children }: { children: ReactNode }) {
  const router = useRouter();

  return (
    <div className="flex">
      <Nav></Nav>
      <div className="sm:grow sm:max-w-xl sm:border-r-[1px] lg:min-w-[58%]">
        {children}
      </div>
      <div className="hidden grow justify-center items-start pt-1 lg:flex">
        {router.pathname !== '/search' && (
          <SearchInput onSubmit={pushToSearchPage} />
        )}
      </div>
    </div>
  );

  function pushToSearchPage(value: string) {
    router.push(`/search?q=${value}`);
  }
}
