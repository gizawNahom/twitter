import { Error } from '../../components/error';
import { getByText, renderElement } from '../testUtilities';

const ERROR_MESSAGE = /something went wrong/i;

test('renders error message', () => {
  renderElement(<Error />);

  expect(getByText(ERROR_MESSAGE)).toBeVisible();
});
