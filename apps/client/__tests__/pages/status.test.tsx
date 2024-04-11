import { screen, waitFor } from '@testing-library/react';
import Status from '../../pages/[userId]/status/[id]';
import { genericErrorHandler, wasPostCalled } from '../../mocks/handlers';
import { server } from '../../mocks/server';
import {
  assertErrorIsNotShown,
  queryErrorComponent,
  querySpinner,
  renderElement,
  setUpApi,
  setUpMockRouter,
} from '../testUtilities/helpers';
import { samplePostResponse } from '../../mocks/values';
import { BACK_BUTTON_TEST_ID } from '../testUtilities/testIds';

jest.mock('next/router', () => ({
  useRouter: jest.fn(),
}));

const PAGE_TITLE = /post/i;

function renderSUT() {
  renderElement(<Status />);
}

function assertWasPostCalled(value: boolean) {
  expect(wasPostCalled).toBe(value);
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

function assertSpinnerIsNotShown(): void | Promise<void> {
  expect(querySpinner()).toBeNull();
}

setUpMockRouter({
  query: {
    id: 'id1',
  },
});

setUpApi();

test('initial state', async () => {
  renderSUT();

  assertWasPostCalled(false);
  expect(screen.queryByText(PAGE_TITLE)).not.toBeNull();
  await waitFor(() => expect(querySpinner()).not.toBeNull());
  assertErrorIsNotShown();
  assertPostIsNotShown();
  expect(screen.queryByTestId(BACK_BUTTON_TEST_ID)).toBeVisible();
});

test('success state', async () => {
  renderSUT();

  await waitFor(() => assertSpinnerIsNotShown());
  assertWasPostCalled(true);
  expect(queryPostText()).not.toBeNull();
  expect(queryPostTime()).not.toBeNull();
  assertErrorIsNotShown();
});

test('error state', async () => {
  server.use(genericErrorHandler);

  renderSUT();

  await waitFor(() => expect(queryErrorComponent()).not.toBeNull());
  assertSpinnerIsNotShown();
  assertPostIsNotShown();
});
