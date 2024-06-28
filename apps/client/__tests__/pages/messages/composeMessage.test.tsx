import ComposeMessage from '../../../pages/messages/compose';
import {
  CLOSE_MESSAGE_PAGE_BUTTON_TEST_ID,
  PEOPLE_SEARCH_TEST_ID,
  getByTestId,
  getByText,
  renderElement,
} from '../../testUtilities';
import { screen } from '@testing-library/react';

jest.mock('next/router', () => ({
  useRouter: jest.fn(),
}));

test('initial', () => {
  renderElement(<ComposeMessage />);

  expect(getByText(/new message/i)).toBeInTheDocument();
  assertNextButtonIsDisabled();
  expect(getByTestId(CLOSE_MESSAGE_PAGE_BUTTON_TEST_ID)).toBeInTheDocument();
  expect(getByTestId(PEOPLE_SEARCH_TEST_ID)).toBeInTheDocument();
});

function assertNextButtonIsDisabled() {
  const nextButton = screen.getByRole('button', { name: /next/i });
  expect(nextButton).toBeInTheDocument();
  expect(nextButton).toBeDisabled();
}
