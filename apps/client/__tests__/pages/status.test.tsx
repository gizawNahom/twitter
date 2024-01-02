import { screen, waitFor } from '@testing-library/react';
import { Status } from '../../pages/[userId]/status/[id]';
import userEvent from '@testing-library/user-event';
import { errorHandler, wasPostCalled } from '../../mocks/handlers';
import { useRouter } from 'next/router';
import { server } from '../../mocks/server';
import {
  addNewStore,
  renderElement,
  setUpClient,
  setUpMSW,
} from '../utilities';
import { createPostResponse } from '../../mocks/values';

jest.mock('next/router', () => ({
  useRouter: jest.fn(),
}));

const back = jest.fn();

const PAGE_TITLE = /post/i;
const BACK_BUTTON = /back/i;
const LOADING = /loading/i;
const ERROR_MESSAGE = /something went wrong/i;

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
  renderElement(addNewStore(<Status />));
}

function assertWasCalled(value: boolean) {
  expect(wasPostCalled).toBe(value);
}

function assertErrorMessageIsNotShown() {
  expect(screen.queryByText(ERROR_MESSAGE)).toBeNull();
}

function assertPostIsNotShown() {
  expect(queryPostText()).toBeNull();
  expect(queryPostTime()).toBeNull();
}

function queryPostTime() {
  const options: Intl.DateTimeFormatOptions = {
    hour: 'numeric',
    minute: 'numeric',
    day: 'numeric',
    month: 'short',
    year: 'numeric',
  };
  const postTime = screen.queryByText(
    new Intl.DateTimeFormat('en-US', options).format(
      new Date(createPostResponse.createdAt)
    )
  );
  return postTime;
}

function queryPostText(): HTMLElement | null {
  return screen.queryByText(createPostResponse.text);
}

function assertLoadingIsNotShown(): void | Promise<void> {
  expect(queryLoading()).toBeNull();
}
function queryLoading(): HTMLElement | null {
  return screen.queryByText(LOADING);
}

beforeAll(() => {
  mockRouter();
});

afterEach(() => jest.clearAllMocks());

setUpClient();

setUpMSW();

test('initial state', async () => {
  renderSUT();

  assertWasCalled(false);
  expect(screen.queryByText(PAGE_TITLE)).not.toBeNull();
  expect(screen.queryByRole('button', { name: BACK_BUTTON })).not.toBeNull();
  await waitFor(() => expect(queryLoading()).not.toBeNull());
  assertErrorMessageIsNotShown();
  assertPostIsNotShown();
});

test('return to previous page by clicking back', async () => {
  renderSUT();

  await userEvent.click(screen.getByRole('button', { name: BACK_BUTTON }));

  expect(back).toHaveBeenCalledTimes(1);
});

test('success state', async () => {
  renderSUT();

  await waitFor(() => assertLoadingIsNotShown());
  assertWasCalled(true);
  expect(queryPostText()).not.toBeNull();
  expect(queryPostTime()).not.toBeNull();
  assertErrorMessageIsNotShown();
});

test('error state', async () => {
  server.use(errorHandler);

  renderSUT();

  await waitFor(() => expect(screen.queryByText(ERROR_MESSAGE)).not.toBeNull());
  assertLoadingIsNotShown();
  assertPostIsNotShown();
});
