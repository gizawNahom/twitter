import { screen } from '@testing-library/react';
import { Nav } from '../../components/nav';
import {
  renderElement,
  POST_FAB_TEST_ID,
  getByTestId,
  mockRouter,
} from '../testUtilities';

const HOME_LINK = '/home';
const PROFILE_LINK = '/username';
const SEARCH_LINK = '/search';
const MESSAGES_LINK = '/messages';

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

  expect(screen.queryByRole('link', { name: HOME_LINK }));
  expect(screen.queryByRole('link', { name: PROFILE_LINK }));
  expect(screen.queryByRole('link', { name: SEARCH_LINK }));
  expect(screen.queryByRole('link', { name: MESSAGES_LINK }));
  expect(getByTestId(POST_FAB_TEST_ID)).toBeInTheDocument();
});

test('hides post fab on messages screen', () => {
  mockRouter({ pathname: MESSAGES_LINK });

  renderSUT();

  expect(screen.queryByTestId(POST_FAB_TEST_ID)).not.toBeInTheDocument();
});

test('hides post fab on compose tweet screen', () => {
  mockRouter({ pathname: '/compose/tweet' });

  renderSUT();

  expect(screen.queryByTestId(POST_FAB_TEST_ID)).not.toBeInTheDocument();
});
