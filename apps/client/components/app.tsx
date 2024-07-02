import { ReactNode } from 'react';
import { Nav } from './nav';
import { SearchBar } from './searchBar';
import { useRouter } from 'next/router';

export function App({ children }: { children: ReactNode }) {
  const router = useRouter();

  return (
    <div className="flex 2xl:justify-center">
      <div className="sm:basis-1/6 lg:basis-28 xl:basis-1/4 2xl:basis-72">
        <Nav></Nav>
      </div>
      <div className="w-full sm:grow sm:max-w-xl sm:border-r-[1px] lg:max-w-[600px] lg:min-w-[600px]">
        {children}
      </div>
      <div className="hidden grow items-start pt-1 lg:flex lg:px-5 xl:px-8 xl:max-w-[412px] xl:min-w-[412px]">
        {router.pathname !== '/search' && (
          <div className="w-full">
            <SearchBar onSubmit={pushToSearchPage} />
          </div>
        )}
      </div>
    </div>
  );

  function pushToSearchPage(value: string) {
    router.push(`/search?q=${value}`);
  }
}
