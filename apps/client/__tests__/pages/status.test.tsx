import { render, screen, waitFor } from '@testing-library/react';
import { Status } from '../../pages/[userId]/status/[id]';
import userEvent from '@testing-library/user-event';
import { wasPostCalled } from '../../mocks/handlers';
import { useRouter } from 'next/router';
import { reducer } from '../../lib/redux/rootReducer';
import { configureStore } from '@reduxjs/toolkit';
import { Provider } from 'react-redux';
import { server } from 'apps/client/mocks/server';
import { setCLient } from '../utilities';
import { createPostResponse } from '../../mocks/values';

jest.mock('next/router', () => ({
  useRouter: jest.fn(),
}));

const back = jest.fn();

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
  setCLient();
});

afterEach(() => jest.clearAllMocks());

setUpMSW();

test('Initial state', async () => {
  renderSUT();

  expect(screen.queryByText(/post/i)).not.toBeNull();
  expect(screen.queryByRole('button', { name: /back/i })).not.toBeNull();
  await waitFor(() => expect(screen.queryByText(/loading/i)).not.toBeNull());
});

test('return to previous page by clicking back', async () => {
  renderSUT();

  await userEvent.click(screen.getByRole('button', { name: /back/i }));

  expect(back).toHaveBeenCalledTimes(1);
});

test('Success state', async () => {
  renderSUT();

  await waitFor(() => expect(screen.queryByText(/loading/i)).toBeNull());
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
