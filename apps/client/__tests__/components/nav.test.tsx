import { screen } from '@testing-library/react';
import { Nav } from '../../components/nav';
import { renderElement } from '../testUtilities/helpers';
import { POST_FAB_TEST_ID } from '../testUtilities/testIds';

const HOME_LINK = '/home';

jest.mock('next/router', () => ({
  useRouter: jest.fn().mockImplementation(() => ({
    pathname: '/path',
  })),
}));

test('initial', async () => {
  renderElement(<Nav />);

  expect(screen.queryByRole('link', { name: HOME_LINK }));
  expect(screen.getByTestId(POST_FAB_TEST_ID)).toBeInTheDocument();
});
