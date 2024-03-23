import { waitFor } from '@testing-library/react';
import { Posts } from '../../components/posts';
import {
  queryErrorComponent,
  querySpinner,
  renderElement,
  setUpApi,
} from '../testUtilities/helpers';

function renderSUT(fetchPosts = async () => []) {
  renderElement(<Posts fetchPosts={fetchPosts} />);
}

setUpApi();

test('initial', async () => {
  renderSUT();

  expect(queryErrorComponent()).toBeNull();
  await waitFor(() => {
    expect(querySpinner()).toBeInTheDocument();
  });
});

test('error', async () => {
  renderSUT(async () => {
    throw new Error();
  });

  await waitFor(() => expect(queryErrorComponent()).not.toBeNull());
  expect(querySpinner()).not.toBeInTheDocument();
});
