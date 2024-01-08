import { screen } from '@testing-library/react';
import { Nav } from '../../components/nav';
import { renderElement } from '../utilities';

const HOME_Link = '/home';

jest.mock('next/router', () => ({
  useRouter: jest.fn().mockImplementation(() => ({
    pathname: '/path',
  })),
}));

test('displays links', async () => {
  renderElement(<Nav />);

  expect(screen.queryByRole('link', { name: HOME_Link }));
});
