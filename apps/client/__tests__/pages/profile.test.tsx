import { screen, waitFor } from '@testing-library/react';
import Profile from '../../pages/username';
import { renderElement, setUpApi } from '../utilities/helpers';
import { BACK_BUTTON_TEST_ID, POSTS_TEST_ID } from '../utilities/testIds';
import { samplePostResponse } from '../../mocks/values';
import { postsVariables } from '../../mocks/handlers';

jest.mock('next/router', () => ({
  useRouter: jest.fn(),
}));

function queryPostTime() {
  const options: Intl.DateTimeFormatOptions = {
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

async function assertPostsRender() {
  await waitFor(() => {
    expect(screen.getByText(samplePostResponse.text)).toBeVisible();
    expect(queryPostTime()).toBeVisible();
  });
}

function assertUserIdInAPICall() {
  const { userId } = postsVariables;
  expect(userId).toBe('userId1');
}

setUpApi();

test('initial', async () => {
  renderElement(<Profile />);

  await assertPostsRender();
  expect(screen.getByText(/posts/i)).toBeVisible();
  expect(screen.getByTestId(POSTS_TEST_ID)).toBeVisible();
  expect(screen.queryByTestId(BACK_BUTTON_TEST_ID)).toBeVisible();
  assertUserIdInAPICall();
}, 10000);
