import { waitFor } from '@testing-library/react';
import Profile from '../../pages/username';
import {
  renderElement,
  queryByTestId,
  querySamplePostTime,
  setUpApi,
  getByTestId,
  getByText,
  BACK_BUTTON_TEST_ID,
  POSTS_TEST_ID,
} from '../testUtilities';
import { samplePostResponse } from '../../mocks/values';
import { postsVariables, wasPostsCalled } from '../../mocks/handlers';

jest.mock('next/router', () => ({
  useRouter: jest.fn(),
}));

async function assertPostsRender() {
  await waitFor(() => {
    expect(getByText(samplePostResponse.text)).toBeVisible();
    expect(
      querySamplePostTime({
        day: 'numeric',
        month: 'short',
        year: 'numeric',
      })
    ).toBeVisible();
  });
}

function assertApiCall() {
  expect(wasPostsCalled).toBe(true);
  const { limit, offset, userId } = postsVariables;
  expect(limit).toBe(20);
  expect(offset).toBe(0);
  expect(userId).toBe('userId1');
}

setUpApi();

test('initial', async () => {
  renderElement(<Profile />);

  await assertPostsRender();
  expect(getByText(/posts/i)).toBeVisible();
  expect(getByTestId(POSTS_TEST_ID)).toBeVisible();
  expect(queryByTestId(BACK_BUTTON_TEST_ID)).toBeVisible();
  assertApiCall();
}, 10000);
