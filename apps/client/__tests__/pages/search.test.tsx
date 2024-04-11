import { screen, waitFor } from '@testing-library/react';
import Search from '../../pages/search';
import {
  assertErrorIsNotShown,
  assertSpinnerIsNotShown,
  pressEnterOnInput,
  renderElement,
  setUpApi,
  setUpMockRouter,
  typeQueryOnSearchInput,
} from '../testUtilities/helpers';
import {
  BACK_BUTTON_TEST_ID,
  ERROR_TEST_ID,
  POSTS_TEST_ID,
  SPINNER_TEST_ID,
} from '../testUtilities/testIds';
import {
  samplePostResponse,
  sampleQuery,
  searchPostsResponse,
} from '../../mocks/values';
import { genericErrorHandler, searchPostsCalls } from '../../mocks/handlers';
import { server } from '../../mocks/server';
import { GraphQLVariables } from 'msw';

jest.mock('next/router', () => ({
  useRouter: jest.fn(),
}));

function renderSUT() {
  renderElement(<Search />);
}

function getByTestId(testId: string): HTMLElement {
  return screen.getByTestId(testId);
}

async function waitTillAllPostsAreRendered() {
  await waitFor(() => {
    expect(getByTestId(POSTS_TEST_ID)).toBeInTheDocument();
  });
  await waitFor(() => {
    expect(screen.getAllByText(samplePostResponse.text).length).toEqual(
      2 * searchPostsResponse.length
    );
  });
}

async function waitForErrorToBeInTheDocument() {
  await waitFor(() =>
    expect(screen.getByTestId(ERROR_TEST_ID)).toBeInTheDocument()
  );
}

async function waitForSpinnerToBeInTheDocument() {
  await waitFor(() => expect(getByTestId(SPINNER_TEST_ID)).toBeInTheDocument());
}

function assertTwoAPICallsUsingSampleQuery() {
  expect(searchPostsCalls).toHaveLength(2);
  assertAnAPICall(searchPostsCalls[0], 0);
  assertAnAPICall(searchPostsCalls[1], 1);

  function assertAnAPICall(call: GraphQLVariables, offset: number) {
    expect(call.limit).toBe(20);
    expect(call.offset).toBe(offset);
    expect(call.query).toBe(sampleQuery);
  }
}

function assertStaticComponents() {
  expect(getByTestId(BACK_BUTTON_TEST_ID)).toBeInTheDocument();
  expect(getByTestId('searchInput')).toBeInTheDocument();
}

function assertPostsIsNotShown() {
  expect(screen.queryByTestId(POSTS_TEST_ID)).not.toBeInTheDocument();
}

function assertQueryParameterIsChangedToTypedQuery(
  push: jest.Mock,
  query: string
) {
  expect(push).toHaveBeenCalledTimes(1);
  expect(push).toHaveBeenCalledWith(`/search?q=${query}`);
}

setUpApi();

beforeEach(() => searchPostsCalls.splice(0, searchPostsCalls.length));

describe('Search from a query variable', () => {
  setUpMockRouter({
    query: {
      q: sampleQuery,
    },
  });

  test('initial', async () => {
    renderSUT();

    await waitForSpinnerToBeInTheDocument();
    expect(screen.getByDisplayValue(sampleQuery)).toBeInTheDocument();
    assertPostsIsNotShown();
    assertErrorIsNotShown();
  });

  test('success', async () => {
    renderSUT();

    await waitForSpinnerToBeInTheDocument();
    await waitTillAllPostsAreRendered();
    assertErrorIsNotShown();
    assertTwoAPICallsUsingSampleQuery();
  });

  test('error', async () => {
    server.use(genericErrorHandler);

    renderSUT();

    await waitForSpinnerToBeInTheDocument();
    await waitForErrorToBeInTheDocument();
    assertPostsIsNotShown();
    assertSpinnerIsNotShown();
  });
});

describe('Search from typing', () => {
  const push = jest.fn();

  setUpMockRouter({ push });

  test('initial', async () => {
    renderSUT();

    assertStaticComponents();
    assertErrorIsNotShown();
    assertSpinnerIsNotShown();
    assertPostsIsNotShown();
    expect(searchPostsCalls).toHaveLength(0);
  });

  test('success', async () => {
    renderSUT();

    await typeQueryOnSearchInput(sampleQuery);
    await pressEnterOnInput();

    await waitForSpinnerToBeInTheDocument();
    await waitTillAllPostsAreRendered();
    assertErrorIsNotShown();
    assertTwoAPICallsUsingSampleQuery();
    assertQueryParameterIsChangedToTypedQuery(push, sampleQuery);
  });

  test('error', async () => {
    server.use(genericErrorHandler);
    renderSUT();

    await typeQueryOnSearchInput(sampleQuery);
    await pressEnterOnInput();

    await waitForSpinnerToBeInTheDocument();
    await waitForErrorToBeInTheDocument();
    assertPostsIsNotShown();
    assertSpinnerIsNotShown();
    assertQueryParameterIsChangedToTypedQuery(push, sampleQuery);
  });
});
