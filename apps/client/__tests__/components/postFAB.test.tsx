import { screen } from '@testing-library/react';
import { PostFAB } from '../../components/postFAB';
import { renderElement } from '../testUtilities';
import { COMPOSE_TWEET } from '../testUtilities/routes';

test('renders a link to compose tweet', () => {
  renderElement(<PostFAB />);

  const link = screen.getByLabelText(/compose tweet/i);
  expect(link.getAttribute('href')).toBe(COMPOSE_TWEET);
});
