import { screen } from '@testing-library/react';
import { Nav } from '../../components/nav';
import { renderElement } from '../utilities';

const HOME_TEXT = /Home/i;

test('displays links', async () => {
  renderElement(<Nav />);

  expect(screen.queryByText(HOME_TEXT)).toHaveAttribute('href', '/home');
});
