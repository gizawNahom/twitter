import { screen } from '@testing-library/react';
import { Nav } from '../../components/nav';
import {
  renderElement,
  POST_FAB_TEST_ID,
  getByTestId,
  mockRouter,
} from '../testUtilities';
import { HOME, MESSAGES, PROFILE, SEARCH } from '../testUtilities/routes';

function renderSUT() {
  renderElement(<Nav />);
}

jest.mock('next/router', () => ({
  useRouter: jest.fn(),
}));

afterEach(() => jest.clearAllMocks());

test('initial', () => {
  mockRouter({ pathname: '/path' });

  renderSUT();

  expect(screen.queryByRole('link', { name: HOME }));
  expect(screen.queryByRole('link', { name: PROFILE }));
  expect(screen.queryByRole('link', { name: SEARCH }));
  expect(screen.queryByRole('link', { name: MESSAGES }));
  expect(getByTestId(POST_FAB_TEST_ID)).toBeInTheDocument();
});

test('hides post fab on messages screen', () => {
  mockRouter({ pathname: MESSAGES });

  renderSUT();

  expect(screen.queryByTestId(POST_FAB_TEST_ID)).not.toBeInTheDocument();
});

test('hides post fab on compose tweet screen', () => {
  mockRouter({ pathname: '/compose/tweet' });

  renderSUT();

  expect(screen.queryByTestId(POST_FAB_TEST_ID)).not.toBeInTheDocument();
});
