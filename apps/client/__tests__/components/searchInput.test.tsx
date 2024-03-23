import { screen } from '@testing-library/react';
import { SearchInput } from '../../components/searchInput';
import {
  clickElement,
  getByPlaceholderText,
  renderElement,
  setUpMockRouter,
} from '../testUtilities/helpers';
import userEvent from '@testing-library/user-event';

jest.mock('next/router', () => ({
  useRouter: jest.fn(),
}));

const SEARCH_INPUT_PLACEHOLDER_TEXT = /search/i;
const CLEAR_TEXT_LABEL = /clear text/i;
const sampleQuery = 'hello';

const push = jest.fn();

function renderSUT() {
  renderElement(<SearchInput />);
}

function getSearchInput(): HTMLElement {
  return getByPlaceholderText(SEARCH_INPUT_PLACEHOLDER_TEXT);
}

async function typeSampleQueryOnInput() {
  await userEvent.type(getSearchInput(), sampleQuery);
}

async function pressEnterOnInput() {
  await userEvent.type(getSearchInput(), '{enter}');
}

setUpMockRouter({ push });

test('initial', () => {
  renderSUT();

  expect(getSearchInput()).toBeInTheDocument();
  expect(screen.queryByLabelText(CLEAR_TEXT_LABEL)).not.toBeInTheDocument();
});

test('clears text', async () => {
  renderSUT();

  await typeSampleQueryOnInput();
  await clickElement(screen.getByLabelText(CLEAR_TEXT_LABEL));

  expect(screen.queryByDisplayValue(sampleQuery)).not.toBeInTheDocument();
});

test('does not push route on "enter" for empty text', async () => {
  renderSUT();

  await pressEnterOnInput();

  expect(push).not.toHaveBeenCalled();
});

test('pushes route on "enter"', async () => {
  renderSUT();

  await typeSampleQueryOnInput();
  await pressEnterOnInput();

  expect(push).toHaveBeenCalledTimes(1);
  expect(push).toHaveBeenCalledWith(`/search?q=${sampleQuery}`);
});
