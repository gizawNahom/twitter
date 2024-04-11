import { waitFor } from '@testing-library/react';
import { Posts } from '../../components/posts';
import {
  assertErrorIsNotShown,
  assertSpinnerIsNotShown,
  createSamplePost,
  queryErrorComponent,
  querySpinner,
  renderElement,
  setUpApi,
} from '../testUtilities/helpers';
import { Post } from '../../lib/redux/slices/postsSlice/post';

function renderSUT({
  fetchPosts = async (offset: number) => [] as Post[],
  firstPagePosts = [] as Post[],
}) {
  renderElement(
    <Posts fetchPosts={fetchPosts} firstPagePosts={firstPagePosts} />
  );
}

setUpApi();

test('initial', async () => {
  renderSUT({});

  assertErrorIsNotShown();
  await waitFor(() => {
    expect(querySpinner()).toBeInTheDocument();
  });
});

describe('starts from first page', () => {
  test.each([[undefined], [[]], [null]])(
    'when "firstPagePosts" is %s',
    async (firstPagePosts) => {
      const fetch = jest.fn();

      renderSUT({
        fetchPosts: async (offset: number) => {
          fetch(offset);
          return [];
        },
        firstPagePosts: firstPagePosts as [] | undefined,
      });

      await waitFor(() => assertSpinnerIsNotShown());
      expect(fetch).toHaveBeenCalledTimes(1);
      expect(fetch).toHaveBeenCalledWith(0);
    }
  );
});

test('starts from second page when "firstPagePosts" is given', async () => {
  const fetch = jest.fn();
  const firstPagePosts: Post[] = [createSamplePost()];

  renderSUT({
    fetchPosts: async (offset: number) => {
      fetch(offset);
      return [];
    },
    firstPagePosts,
  });

  await waitFor(() => assertSpinnerIsNotShown());
  expect(fetch).toHaveBeenCalledTimes(1);
  expect(fetch).toHaveBeenCalledWith(1);
});

test('error', async () => {
  renderSUT({
    fetchPosts: async () => {
      throw new Error();
    },
  });

  await waitFor(() => expect(queryErrorComponent()).not.toBeNull());
  expect(querySpinner()).not.toBeInTheDocument();
});
