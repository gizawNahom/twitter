import { getByRole, renderElement } from '../../../testUtilities';
import { ComposeMessageFAB } from '../../../../lib/messages/presentation/pages/messages';
import { MESSAGES_COMPOSE } from '../../../testUtilities/routes';

test('renders a link to compose message', () => {
  renderElement(<ComposeMessageFAB />);

  const link = getByRole('link', { name: /compose message/i });
  expect(link.getAttribute('href')).toBe(MESSAGES_COMPOSE);
});
