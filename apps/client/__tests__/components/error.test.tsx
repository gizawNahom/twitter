import { Error } from '../../components/error';
import { renderElement } from '../testUtilities/helpers';
import { screen } from '@testing-library/react';

const ERROR_MESSAGE = /something went wrong/i;

test('renders error message', () => {
  renderElement(<Error />);

  expect(screen.getByText(ERROR_MESSAGE)).toBeVisible();
});
