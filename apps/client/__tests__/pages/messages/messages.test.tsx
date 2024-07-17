import Messages from '../../../lib/messages/presentation/pages/messages';
import {
  COMPOSE_MESSAGE_FAB_TEST_ID,
  getByTestId,
  renderElement,
} from '../../testUtilities';

test('initial', () => {
  renderElement(<Messages />);

  expect(getByTestId(COMPOSE_MESSAGE_FAB_TEST_ID)).toBeInTheDocument();
});
