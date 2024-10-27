import { ReactNode, useState } from 'react';
import InfiniteScroll from 'react-infinite-scroller';
import { Spinner } from './spinner';

export function Infinite({
  hasMore,
  children,
  fetchMethod,
}: {
  hasMore: boolean;
  children: ReactNode;
  fetchMethod: () => Promise<void>;
}) {
  const [isLoading, setIsLoading] = useState(false);

  return (
    <div className=" h-[inherit] max-h-inherit w-full overflow-auto ">
      <InfiniteScroll
        hasMore={hasMore}
        loadMore={loadMore}
        loader={<Spinner key="loader" />}
        pageStart={0}
        useWindow={false}
        isReverse={true}
      >
        <div className=" flex flex-col-reverse">{children}</div>
      </InfiniteScroll>
    </div>
  );

  async function loadMore() {
    if (!isLoading) {
      setIsLoading(true);
      await fetchMethod();
      setIsLoading(false);
    }
  }
}
