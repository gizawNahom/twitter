import { waitFor } from '@testing-library/react';
import { Posts } from '../../components/posts';
import {
  queryErrorComponent,
  querySpinner,
  renderElement,
  setUpClient,
  setUpMSW,
} from '../utilities/helpers';
import { server } from '../../mocks/server';
import {
  postsErrorHandler,
  postsVariables,
  wasPostsCalled,
} from '../../mocks/handlers';

function renderSUT() {
  renderElement(<Posts />);
}

function assertApiCall() {
  expect(wasPostsCalled).toBe(true);
  const { limit, offset } = postsVariables;
  expect(limit).toBe(20);
  expect(offset).toBe(0);
}

setUpClient();
setUpMSW();

test('initial', async () => {
  renderSUT();

  expect(wasPostsCalled).toBe(false);
  expect(queryErrorComponent()).toBeNull();
  await waitFor(() => {
    expect(querySpinner()).toBeInTheDocument();
  });
});

test('error', async () => {
  server.use(postsErrorHandler);

  renderSUT();

  await waitFor(() => expect(queryErrorComponent()).not.toBeNull());
  expect(querySpinner()).not.toBeInTheDocument();
  assertApiCall();
});
