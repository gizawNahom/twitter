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
      {children}
      {router.pathname !== '/search' && router.pathname !== '/messages' && (
        <div className="hidden grow items-start pt-1 lg:flex lg:justify-start lg:px-5 xl:justify-center xl:px-8 xl:max-w-[412px] xl:min-w-[412px]">
          <div className="w-full max-w-[350px]">
            <SearchBar onSubmit={pushToSearchPage} />
          </div>
        </div>
      )}
    </div>
  );

  function pushToSearchPage(value: string) {
    router.push(`/search?q=${value}`);
  }
}

export function PageContainer({ children }: { children: ReactNode }) {
  return (
    <div className="w-full sm:grow sm:max-w-xl sm:border-r-[1px] lg:max-w-[600px] lg:min-w-[600px]">
      {children}
    </div>
  );
}
