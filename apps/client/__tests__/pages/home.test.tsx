import {
  clickPostButton,
  renderElement,
  setUpApi,
} from '../testUtilities/helpers';
import Home from '../../pages/home';
import { screen, waitFor } from '@testing-library/react';
import { POST_FORM_TEST_ID } from '../testUtilities/testIds';
import { App } from '../../components/app';
import userEvent from '@testing-library/user-event';
import { POST_INPUT_PLACE_HOLDER_TEXT } from '../testUtilities/texts';

jest.mock('next/router', () => ({
  useRouter: jest.fn().mockImplementation(() => ({
    pathname: '/home',
  })),
}));

const POST_CREATION_MESSAGE = /Post created/i;

setUpApi();

test('initial', () => {
  renderElement(<Home />);

  expect(screen.getByTestId(POST_FORM_TEST_ID)).toBeInTheDocument();
  expect(screen.queryByText(POST_CREATION_MESSAGE)).not.toBeInTheDocument();
});

test('renders toast on successful post creation', async () => {
  renderElement(
    <App>
      <Home />
    </App>
  );

  await userEvent.type(
    screen.getByPlaceholderText(POST_INPUT_PLACE_HOLDER_TEXT),
    'hello world'
  );
  await clickPostButton();

  await waitFor(() =>
    expect(screen.getByText(POST_CREATION_MESSAGE)).toBeInTheDocument()
  );
});
