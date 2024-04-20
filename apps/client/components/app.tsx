import { ReactNode } from 'react';
import { Nav } from './nav';
import { SearchInput } from './searchInput';
import { useRouter } from 'next/router';

export function App({ children }: { children: ReactNode }) {
  const router = useRouter();

  return (
    <div className="flex">
      <Nav></Nav>
      <div className="grow sm:max-w-xl sm:border-r-[1px]">{children}</div>
      <div className="hidden sm:block">
        <SearchInput onSubmit={pushToSearchPage} />
      </div>
    </div>
  );

  function pushToSearchPage(value: string) {
    router.push(`/search?q=${value}`);
  }
}
