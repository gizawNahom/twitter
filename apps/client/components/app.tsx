import { ReactNode } from 'react';
import { Nav } from './nav';
import { SearchInput } from './searchInput';
import { useRouter } from 'next/router';

export function App({ children }: { children: ReactNode }) {
  const router = useRouter();

  return (
    <div className="flex">
      <Nav></Nav>
      <div className="sm:grow sm:max-w-xl sm:border-r-[1px] lg:min-w-[58%] xl:min-w-[45%]">
        {children}
      </div>
      <div className="hidden grow items-start pt-1 lg:flex lg:px-5 xl:px-8">
        {router.pathname !== '/search' && (
          <div className="w-full">
            <SearchInput onSubmit={pushToSearchPage} />
          </div>
        )}
      </div>
    </div>
  );

  function pushToSearchPage(value: string) {
    router.push(`/search?q=${value}`);
  }
}
