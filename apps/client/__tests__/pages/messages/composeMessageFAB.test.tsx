import { getByRole, renderElement } from '../../testUtilities';
import { ComposeMessageFAB } from '../../../pages/messages/index';
import { MESSAGES_COMPOSE } from '../../testUtilities/routes';

test('renders a link to compose message', () => {
  renderElement(<ComposeMessageFAB />);

  const link = getByRole('link', { name: /compose message/i });
  expect(link.getAttribute('href')).toBe(MESSAGES_COMPOSE);
});
