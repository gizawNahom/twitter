import { screen } from '@testing-library/react';
import ComposeTweet from '../../pages/compose/tweet';
import { addNewStore, renderElement } from '../utilities';

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

test('renders post input', () => {
  renderSUT();

  expect(screen.queryByTestId('post-input')).toBeVisible();
});
