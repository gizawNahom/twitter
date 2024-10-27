import { Spinner } from '../../components/spinner';
import { useRef, useState } from 'react';
import InfiniteScroll from 'react-infinite-scroller';

export default function Test() {
  const [hasMore, setHasMore] = useState(true);
  const [isLoading, setIsLoading] = useState(false);
  const lazyLoader = useRef(lazyLoadIntegers(50));
  const [integers, setIntegers] = useState<number[]>([]);

  return (
    <div>
      <header>test</header>
      <div className=" h-56 max-h-56 w-full bg-green-300 overflow-auto ">
        <InfiniteScroll
          hasMore={hasMore}
          loadMore={fetchIntegers}
          loader={<Spinner key="loader" />}
          pageStart={0}
          useWindow={false}
          isReverse={true}
        >
          <div className=" flex flex-col-reverse">
            {integers.map((integer, i) => {
              return (
                <p key={i}>
                  <br />
                  {integer}
                  <br />
                </p>
              );
            })}
          </div>
        </InfiniteScroll>
      </div>
    </div>
  );

  function fetchIntegers() {
    if (!isLoading) {
      setIsLoading(true);
      const { value, done } = lazyLoader.current.next();
      setIntegers([...integers, value]);
      if (done) setHasMore(false);
      setTimeout(() => {
        setIsLoading(false);
      }, 700);
    }
  }
}

function* lazyLoadIntegers(limit: number): Generator<number> {
  for (let i = 0; i < limit; i++) {
    yield i;
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
