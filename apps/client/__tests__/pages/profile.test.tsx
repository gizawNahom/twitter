import { screen, waitFor } from '@testing-library/react';
import Profile from '../../pages/username';
import { renderElement, setUpClient, setUpMSW } from '../utilities/helpers';
import { BACK_BUTTON_TEST_ID } from '../utilities/testIds';
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
  const { id } = postsVariables;
  expect(id).toBe('userId1');
}

setUpClient();
setUpMSW();

test('initial', async () => {
  renderElement(<Profile />);

  await assertPostsRender();
  expect(screen.getByText(/posts/i)).toBeVisible();
  expect(screen.getByTestId('posts')).toBeVisible();
  expect(screen.queryByTestId(BACK_BUTTON_TEST_ID)).toBeVisible();
  assertUserIdInAPICall();
});
