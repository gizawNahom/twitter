import { screen, waitFor } from '@testing-library/react';
import Status from '../../pages/[userId]/status/[id]';
import { errorHandler, wasPostCalled } from '../../mocks/handlers';
import { useRouter } from 'next/router';
import { server } from '../../mocks/server';
import {
  addNewStore,
  renderElement,
  setUpClient,
  setUpMSW,
} from '../utilities';
import { samplePostResponse } from '../../mocks/values';

jest.mock('next/router', () => ({
  useRouter: jest.fn(),
}));

const PAGE_TITLE = /post/i;
const LOADING = /loading/i;
const ERROR_MESSAGE = /something went wrong/i;

function mockRouter() {
  const router = useRouter as jest.Mock;
  router.mockImplementation(() => ({
    query: {
      id: 'id1',
    },
  }));
}

function renderSUT() {
  renderElement(addNewStore(<Status />));
}

function assertWasPostCalled(value: boolean) {
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
      new Date(samplePostResponse.createdAt)
    )
  );
  return postTime;
}

function queryPostText(): HTMLElement | null {
  return screen.queryByText(samplePostResponse.text);
}

function assertLoadingIsNotShown(): void | Promise<void> {
  expect(queryLoading()).toBeNull();
}
function queryLoading(): HTMLElement | null {
  return screen.queryByText(LOADING);
}

beforeEach(() => {
  mockRouter();
});

afterEach(() => {
  jest.resetAllMocks();
});

setUpClient();

setUpMSW();

test('initial state', async () => {
  renderSUT();

  assertWasPostCalled(false);
  expect(screen.queryByText(PAGE_TITLE)).not.toBeNull();
  await waitFor(() => expect(queryLoading()).not.toBeNull());
  assertErrorMessageIsNotShown();
  assertPostIsNotShown();
  expect(screen.queryByTestId('back-button')).toBeVisible();
});

test('success state', async () => {
  renderSUT();

  await waitFor(() => assertLoadingIsNotShown());
  assertWasPostCalled(true);
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