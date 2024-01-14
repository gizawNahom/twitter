import { screen } from '@testing-library/react';
import ComposeTweet from '../../pages/compose/tweet';
import { INPUT_PLACE_HOLDER, addNewStore, renderElement } from '../utilities';

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
  expect(screen.getByPlaceholderText(INPUT_PLACE_HOLDER)).toHaveFocus();
});
