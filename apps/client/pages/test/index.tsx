import { Infinite } from '../../components/infinite';
import { useRef, useState } from 'react';

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
