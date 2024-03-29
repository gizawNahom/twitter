import { screen, waitFor } from '@testing-library/react';
import ComposeTweet from '../../pages/compose/tweet';
import {
  clickPostButton,
  createNewStore,
  mockRouter,
  renderElement,
  setUpApi,
  typeText,
} from '../testUtilities/helpers';
import { POST_INPUT_PLACE_HOLDER_TEXT } from '../testUtilities/texts';
import {
  BACK_BUTTON_TEST_ID,
  POST_FORM_TEST_ID,
} from '../testUtilities/testIds';
import { createPostAsync } from '../../lib/redux';
import { EnhancedStore } from '@reduxjs/toolkit';

jest.mock('next/router', () => ({
  useRouter: jest.fn(),
}));

const push = jest.fn();

function renderSUT(store?: EnhancedStore) {
  renderElement(<ComposeTweet />, store);
}

setUpApi();

beforeEach(() => {
  mockRouter({ push });
});

afterEach(() => {
  jest.resetAllMocks();
});

test('initial', () => {
  renderSUT();

  expect(screen.queryByTestId(BACK_BUTTON_TEST_ID)).toBeVisible();
  expect(screen.queryByTestId(POST_FORM_TEST_ID)).toBeVisible();
  expect(
    screen.getByPlaceholderText(POST_INPUT_PLACE_HOLDER_TEXT)
  ).toHaveFocus();
  expect(push).toHaveBeenCalledTimes(0);
});

test('redirects to home on successful post creation', async () => {
  renderSUT();

  await typeText('hello world');
  await clickPostButton();

  await waitFor(() => expect(push).toHaveBeenCalledTimes(1));
  expect(push).toHaveBeenCalledWith('/home');
});

test('does not redirect to home if post creation was already successful', async () => {
  const store = createNewStore();
  await store.dispatch(createPostAsync('Hello'));

  renderSUT(store);

  expect(push).toHaveBeenCalledTimes(0);
});
