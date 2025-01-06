import { ReactNode } from 'react';
import { Nav } from './nav';
import { SearchBar } from './searchBar';
import { useRouter } from 'next/router';
import Marquee from './marquee';

export function App({ children }: { children: ReactNode }) {
  const router = useRouter();

  return (
    <div className="flex 2xl:justify-center max-w-7xl mx-auto">
      <div className="sm:basis-1/6 lg:basis-28 xl:basis-1/4 2xl:basis-72">
        <Nav></Nav>
      </div>
      <div className=" flex basis-full">
        {children}
        {canShowSearchBar() && (
          <div className="hidden grow items-start pt-1 lg:flex lg:justify-start lg:px-5 xl:justify-center xl:px-8 xl:max-w-[412px] xl:min-w-[412px]">
            <div className="w-full max-w-[350px]">
              <SearchBar onSubmit={pushToSearchPage} />
            </div>
          </div>
        )}
      </div>
      <Marquee
        text="The network requests are mocked."
        className="fixed bottom-12 left-0 w-full text-slate-400 text-2xl sm:bottom-0"
        speed={40}
      ></Marquee>
    </div>
  );

  function canShowSearchBar() {
    return (
      router.pathname !== '/search' && !router.pathname.includes('/messages')
    );
  }

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
