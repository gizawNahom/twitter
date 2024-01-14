import { screen } from '@testing-library/react';
import ComposeTweet from '../../pages/compose/tweet';
import { addNewStore, renderElement } from '../utilities/helpers';
import { POST_INPUT_PLACE_HOLDER_TEXT } from '../utilities/texts';

jest.mock('next/router', () => ({
  useRouter: jest.fn(),
}));

function renderSUT() {
  renderElement(addNewStore(<ComposeTweet />));
}

test('renders back button', () => {
  renderSUT();

  expect(screen.queryByTestId('back-button')).toBeVisible();
});

test('renders post input with input focused', () => {
  renderSUT();

  expect(screen.queryByTestId('post-input')).toBeVisible();
  expect(
    screen.getByPlaceholderText(POST_INPUT_PLACE_HOLDER_TEXT)
  ).toHaveFocus();
});
