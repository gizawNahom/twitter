import Messages from '../../../lib/messages/presentation/pages/messages';
import {
  COMPOSE_MESSAGE_FAB_TEST_ID,
  getByTestId,
  getByRole,
  renderElement,
  MESSAGES_COMPOSE,
} from '../../testUtilities';

describe('Given the user has navigated to the page', () => {
  beforeEach(() => {
    renderElement(<Messages />);
  });

  describe('And the user has no chats', () => {
    test('Then the initial elements are displayed', () => {
      expect(getByTestId(COMPOSE_MESSAGE_FAB_TEST_ID)).toBeInTheDocument();
      expect(getByRole('heading', { name: /welcome to your inbox!/i }));
      expect(getByRole('heading', { name: /messages/i }));
      const link = getByRole('link', { name: /write a message/i });
      expect(link).toHaveAttribute('href', MESSAGES_COMPOSE);
    });
  });
});
