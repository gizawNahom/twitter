import { screen } from '@testing-library/react';
import ComposeTweet from '../../pages/compose/tweet';
import { renderElement } from '../testUtilities/helpers';
import { POST_INPUT_PLACE_HOLDER_TEXT } from '../testUtilities/texts';
import {
  BACK_BUTTON_TEST_ID,
  POST_FORM_TEST_ID,
} from '../testUtilities/testIds';

jest.mock('next/router', () => ({
  useRouter: jest.fn(),
}));

function renderSUT() {
  renderElement(<ComposeTweet />);
}

test('renders back button', () => {
  renderSUT();

  expect(screen.queryByTestId(BACK_BUTTON_TEST_ID)).toBeVisible();
});

test('renders post input with input focused', () => {
  renderSUT();

  expect(screen.queryByTestId(POST_FORM_TEST_ID)).toBeVisible();
  expect(
    screen.getByPlaceholderText(POST_INPUT_PLACE_HOLDER_TEXT)
  ).toHaveFocus();
});
