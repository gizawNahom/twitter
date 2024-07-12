import { sampleUserResponse } from '../../../../mocks/values';
import { genericErrorHandler, getUsersCalls } from '../../../../mocks/handlers';
import ComposeMessage from '../../../../pages/messages/compose';
import {
  CLOSE_MESSAGE_PAGE_BUTTON_TEST_ID,
  PEOPLE_SEARCH_TEST_ID,
  clickElement,
  createNewStore,
  getByRole,
  getByTestId,
  getByText,
  renderElement,
  setUpApi,
  setUpMockRouter,
  waitForErrorToBeInTheDocument,
} from '../../../testUtilities';
import { screen, waitFor } from '@testing-library/react';
import { typeOnInput } from './components/userSearchInput.test';
import { server } from '../../../../mocks/server';
import { MESSAGES_CHAT } from '../../../testUtilities';
import { ReduxStore, selectSelectedUser } from '../../../../lib/redux';

jest.mock('next/router', () => ({
  useRouter: jest.fn(),
}));

const push = jest.fn();
let store: ReduxStore;

function renderSUT() {
  store = createNewStore();
  renderElement(<ComposeMessage />, store);
}

function queryProgressbar(): HTMLElement | null {
  return screen.queryByRole('progressbar');
}

function getNextButton(): HTMLElement {
  return getByRole('button', { name: /next/i });
}

function assertNextButtonIsDisabled() {
  expect(getNextButton()).toBeDisabled();
}

function assertNextButtonIsNotDisabled() {
  expect(getNextButton()).not.toBeDisabled();
}

setUpMockRouter({ push });
setUpApi();

beforeEach(() => getUsersCalls.splice(0, getUsersCalls.length));

test('initial', () => {
  renderSUT();

  expect(getByText(/new message/i)).toBeInTheDocument();
  assertNextButtonIsDisabled();
  expect(getByTestId(CLOSE_MESSAGE_PAGE_BUTTON_TEST_ID)).toBeInTheDocument();
  expect(getByTestId(PEOPLE_SEARCH_TEST_ID)).toBeInTheDocument();
  expect(queryProgressbar()).not.toBeInTheDocument();
});

test('loading', async () => {
  renderSUT();

  await typeOnInput('a');

  await waitFor(() => expect(queryProgressbar()).toBeInTheDocument());
  assertNextButtonIsDisabled();
});

test('success', async () => {
  const character = 'a';
  renderSUT();

  await typeOnInput(character);

  await waitFor(() => expect(queryProgressbar()).not.toBeInTheDocument());
  assertUsersAreDisplayed();
  assertApiIsCalledCorrectly(character);
  assertNextButtonIsDisabled();

  function assertUsersAreDisplayed() {
    expect(getByRole('img')).toHaveAttribute(
      'src',
      expect.stringMatching(encodeURIComponent(sampleUserResponse.profilePic))
    );
    expect(getByText(sampleUserResponse.displayName)).toBeInTheDocument();
    expect(getByText('@' + sampleUserResponse.username)).toBeInTheDocument();
  }

  function assertApiIsCalledCorrectly(character: string) {
    expect(getUsersCalls).toHaveLength(1);
    expect(getUsersCalls[0].username).toBe(character);
    expect(getUsersCalls[0].offset).toBe(0);
    expect(getUsersCalls[0].limit).toBe(10);
  }
});

test('error', async () => {
  server.use(genericErrorHandler);
  const character = 'a';
  renderSUT();

  await typeOnInput(character);

  await waitForErrorToBeInTheDocument();
  expect(queryProgressbar()).not.toBeInTheDocument();
  assertNextButtonIsDisabled();
});

test('can select a user', async () => {
  renderSUT();

  await typeOnInput('a');
  await waitFor(() =>
    expect(getByText(sampleUserResponse.displayName)).toBeInTheDocument()
  );
  await clickElement(getByText(sampleUserResponse.displayName));
  await clickElement(getNextButton());

  await waitFor(() =>
    expect(selectSelectedUser(store.getState())).toStrictEqual(
      sampleUserResponse
    )
  );
  assertNextButtonIsNotDisabled();
  expect(screen.queryByDisplayValue('a')).not.toBeInTheDocument();
  assertSelectedUserIsDisplayed();
  expect(push).toHaveBeenCalledTimes(1);
  expect(push).toHaveBeenCalledWith(MESSAGES_CHAT);

  function assertSelectedUserIsDisplayed() {
    expect(getByRole('img')).toHaveAttribute(
      'src',
      expect.stringMatching(encodeURIComponent(sampleUserResponse.profilePic))
    );
    expect(getByText(sampleUserResponse.displayName)).toBeInTheDocument();
    expect(
      screen.queryByText('@' + sampleUserResponse.username)
    ).not.toBeInTheDocument();
  }
});
