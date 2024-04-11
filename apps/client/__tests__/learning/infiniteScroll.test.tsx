import { screen, waitFor } from '@testing-library/react';
import InfiniteScroll from 'react-infinite-scroller';
import { getByText, renderElement } from '../testUtilities';
import { useEffect, useState } from 'react';

test('should render', async () => {
  renderElement(<Component />);

  await waitFor(() => {
    expect(getByText(/loading/i)).toBeInTheDocument();
  });
  await waitFor(() => {
    expect(screen.getAllByText(/item/i).length).toBeGreaterThan(1);
  });
});

function Component() {
  const [items, setItems] = useState<Array<unknown>>([]);
  const [hasMore, setHasMore] = useState(true);

  useEffect(() => {
    fetchMoreData();
  });

  const fetchMoreData = () => {
    if (items.length >= 500) {
      setHasMore(false);
      return;
    }
    setTimeout(() => {
      setItems([...items, ...Array.from({ length: 2 })]);
    }, 900);
  };

  return (
    <InfiniteScroll
      pageStart={0}
      loadMore={fetchMoreData}
      hasMore={hasMore}
      loader={<h1 key="loader">Loading</h1>}
    >
      {items.map((e, i) => (
        <div key={i}>Item {i}</div>
      ))}
    </InfiniteScroll>
  );
}
