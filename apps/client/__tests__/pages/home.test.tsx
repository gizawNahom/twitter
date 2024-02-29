import { renderElement, setUpApi } from '../testUtilities/helpers';
import Home from '../../pages/home';
import { screen, waitFor } from '@testing-library/react';
import { POST_FORM_TEST_ID } from '../testUtilities/testIds';
import { App } from '../../components/app';
import userEvent from '@testing-library/user-event';

jest.mock('next/router', () => ({
  useRouter: jest.fn().mockImplementation(() => ({
    pathname: '/home',
  })),
}));

const POST_BUTTON_TEXT = /^post$/i;
const POST_CREATION_MESSAGE = /Post created/i;

async function typeText(text: string) {
  await userEvent.type(screen.getByRole('textbox'), text);
}

function clickPostButton() {
  return userEvent.click(screen.getByText(POST_BUTTON_TEXT));
}

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

  await typeText('hello world');
  await clickPostButton();

  await waitFor(() =>
    expect(screen.getByText(POST_CREATION_MESSAGE)).toBeInTheDocument()
  );
});
