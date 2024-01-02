import { render, screen, waitFor } from '@testing-library/react';
import { Status } from '../../pages/[userId]/status/[id]';
import userEvent from '@testing-library/user-event';
import { errorHandler, wasPostCalled } from '../../mocks/handlers';
import { useRouter } from 'next/router';
import { reducer } from '../../lib/redux/rootReducer';
import { configureStore } from '@reduxjs/toolkit';
import { Provider } from 'react-redux';
import { server } from '../../mocks/server';
import { setUpClient } from '../utilities';
import { createPostResponse } from '../../mocks/values';

jest.mock('next/router', () => ({
  useRouter: jest.fn(),
}));

const back = jest.fn();

const PAGE_TITLE = /post/i;
const BACK_BUTTON = /back/i;
const LOADING = /loading/i;
const ERROR_MESSAGE = /something went wrong/i;

function setUpMSW() {
  beforeAll(() =>
    server.listen({
      onUnhandledRequest: 'error',
    })
  );
  afterEach(() => server.resetHandlers());
  afterAll(() => server.close());
}

function mockRouter() {
  const router = useRouter as jest.Mock;
  router.mockImplementation(() => ({
    back: back,
    query: {
      id: 'id1',
    },
  }));
}

function renderSUT() {
  const store = configureStore({
    reducer,
    middleware: (getDefaultMiddleware) => {
      return getDefaultMiddleware({
        serializableCheck: false,
      });
    },
  });
  render(
    <Provider store={store}>
      <Status />
    </Provider>
  );
}

beforeAll(() => {
  mockRouter();
});

afterEach(() => jest.clearAllMocks());

setUpClient();

setUpMSW();

test('initial state', async () => {
  renderSUT();

  expect(screen.queryByText(PAGE_TITLE)).not.toBeNull();
  expect(screen.queryByRole('button', { name: BACK_BUTTON })).not.toBeNull();
  await waitFor(() => expect(screen.queryByText(LOADING)).not.toBeNull());
});

test('return to previous page by clicking back', async () => {
  renderSUT();

  await userEvent.click(screen.getByRole('button', { name: BACK_BUTTON }));

  expect(back).toHaveBeenCalledTimes(1);
});

test('success state', async () => {
  renderSUT();

  await waitFor(() => expect(screen.queryByText(LOADING)).toBeNull());
  expect(wasPostCalled).toBe(true);
  expect(screen.queryByText(createPostResponse.text)).not.toBeNull();
  const options: Intl.DateTimeFormatOptions = {
    hour: 'numeric',
    minute: 'numeric',
    day: 'numeric',
    month: 'short',
    year: 'numeric',
  };
  expect(
    screen.queryByText(
      new Intl.DateTimeFormat('en-US', options).format(
        new Date(createPostResponse.createdAt)
      )
    )
  ).not.toBeNull();
});

test('error state', async () => {
  server.use(errorHandler);

  renderSUT();

  await waitFor(() => expect(screen.queryByText(ERROR_MESSAGE)).not.toBeNull());
});
