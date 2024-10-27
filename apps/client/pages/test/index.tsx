import { Spinner } from '../../components/spinner';
import { ReactNode, useRef, useState } from 'react';
import InfiniteScroll from 'react-infinite-scroller';

export default function Test() {
  const [hasMore, setHasMore] = useState(true);
  const lazyLoader = useRef(lazyLoadIntegers(50));
  const [integers, setIntegers] = useState<number[]>([]);

  return (
    <div>
      <header>test</header>
      <div className="h-56 max-h-56 bg-green-400">
        <Infinite hasMore={hasMore} fetchMethod={fetchIntegers}>
          {integers.map((integer, i) => {
            return (
              <p key={i}>
                <br />
                {integer}
                <br />
              </p>
            );
          })}
        </Infinite>
      </div>
    </div>
  );

  async function fetchIntegers() {
    await new Promise((resolve) => setTimeout(resolve, 400));
    const { value, done } = lazyLoader.current.next();
    setIntegers([...integers, value]);
    if (done) setHasMore(false);
  }
}

function* lazyLoadIntegers(limit: number): Generator<number> {
  for (let i = 0; i < limit; i++) {
    yield i;
  }
}

function Infinite({
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

/**
 * COMPONENT PROPOSITION
 *
 * Gives option to reverse
 * handles Is loading state
 *
 * Accepts children
 * Accepts fetch method
 * Accepts has more
 * Has a way to Accept height
 */

/**
 * VERSION 1
 * DOES not give option to reverse
 * Accepts
 * - has more
 * - children
 * - fetch method
 */

/**
 * VERSION 2
 * gives option to reverse
 */
