import { waitFor, screen } from '@testing-library/react';
import { Posts } from '../../components/posts';
import {
  queryErrorComponent,
  renderElement,
  setUpClient,
  setUpMSW,
} from '../utilities/helpers';
import { server } from '../../mocks/server';
import { postsErrorHandler, wasPostsCalled } from '../../mocks/handlers';

const LOADING = /loading/i;

function renderSUT() {
  renderElement(<Posts />);
}

function queryLoading(): HTMLElement | null {
  return screen.queryByText(LOADING);
}

setUpClient();
setUpMSW();

test('initial', async () => {
  renderSUT();

  expect(wasPostsCalled).toBe(false);
  expect(queryErrorComponent()).toBeNull();
  await waitFor(() => {
    expect(queryLoading()).toBeInTheDocument();
  });
});

test('error', async () => {
  server.use(postsErrorHandler);

  renderSUT();

  await waitFor(() => expect(queryErrorComponent()).not.toBeNull());
  expect(queryLoading()).not.toBeInTheDocument();
  expect(wasPostsCalled).toBe(true);
});
