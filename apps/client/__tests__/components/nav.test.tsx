import { screen } from '@testing-library/react';
import { Nav } from '../../components/nav';
import { renderElement } from '../testUtilities/helpers';
import { getByTestId } from '../testUtilities';
import { POST_FAB_TEST_ID } from '../testUtilities/testIds';

const HOME_LINK = '/home';
const PROFILE_LINK = '/username';

jest.mock('next/router', () => ({
  useRouter: jest.fn().mockImplementation(() => ({
    pathname: '/path',
  })),
}));

test('initial', async () => {
  renderElement(<Nav />);

  expect(screen.queryByRole('link', { name: HOME_LINK }));
  expect(screen.queryByRole('link', { name: PROFILE_LINK }));
  expect(getByTestId(POST_FAB_TEST_ID)).toBeInTheDocument();
});
