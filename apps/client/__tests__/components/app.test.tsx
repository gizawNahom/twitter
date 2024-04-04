import { App } from '../../components/app';
import { NAV_TEST_ID, POST_FAB_TEST_ID } from '../testUtilities/testIds';
import {
  getByPlaceholderText,
  renderElement,
  setUpMockRouter,
} from '../testUtilities/helpers';
import { screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';

jest.mock('next/router', () => ({
  useRouter: jest.fn().mockImplementation(() => ({
    pathname: '/path',
  })),
}));

const SEARCH_INPUT_PLACEHOLDER_TEXT = /search/i;
const sampleQuery = 'hello';

const push = jest.fn();

const sampleText = 'test';

function renderSUT() {
  renderElement(
    <App>
      <div>{sampleText}</div>
    </App>
  );
}

async function typeSampleQueryOnInput() {
  await userEvent.type(getSearchInput(), sampleQuery);
}

async function pressEnterOnInput() {
  await userEvent.type(getSearchInput(), '{enter}');
}

function getSearchInput(): HTMLElement {
  return getByPlaceholderText(SEARCH_INPUT_PLACEHOLDER_TEXT);
}

setUpMockRouter({ push });

test('initial', () => {
  renderSUT();

  expect(screen.getByTestId(NAV_TEST_ID)).toBeVisible();
  expect(screen.getByText(sampleText)).toBeVisible();
  expect(screen.getByTestId(POST_FAB_TEST_ID)).toBeVisible();
});

test('search input pushes to search page on "enter"', async () => {
  renderSUT();

  await typeSampleQueryOnInput();
  await pressEnterOnInput();

  expect(push).toHaveBeenCalledTimes(1);
  expect(push).toHaveBeenCalledWith(`/search?q=${sampleQuery}`);
});
