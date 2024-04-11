import {
  setUpApi,
  getByTestId,
  getByText,
  POST_INPUT_PLACE_HOLDER_TEXT,
  clickPostButton,
  renderElement,
  typeText,
  POST_FORM_TEST_ID,
} from '../testUtilities';
import Home from '../../pages/home';
import { screen, waitFor } from '@testing-library/react';
import { App } from '../../components/app';

jest.mock('next/router', () => ({
  useRouter: jest.fn().mockImplementation(() => ({
    pathname: '/home',
  })),
}));

const POST_CREATION_MESSAGE = /Post created/i;

setUpApi();

test('initial', () => {
  renderElement(<Home />);

  expect(getByTestId(POST_FORM_TEST_ID)).toBeInTheDocument();
  expect(screen.queryByText(POST_CREATION_MESSAGE)).not.toBeInTheDocument();
});

test('renders toast on successful post creation', async () => {
  renderElement(
    <App>
      <Home />
    </App>
  );

  await typeText(
    'hello world',
    screen.getByPlaceholderText(POST_INPUT_PLACE_HOLDER_TEXT)
  );
  await clickPostButton();

  await waitFor(() =>
    expect(getByText(POST_CREATION_MESSAGE)).toBeInTheDocument()
  );
});
