import { screen } from '@testing-library/react';
import { SearchInput } from '../../components/searchInput';
import {
  clickElement,
  getByPlaceholderText,
  renderElement,
  typeText,
} from '../testUtilities/helpers';

const SEARCH_INPUT_PLACEHOLDER_TEXT = /search/i;
const CLEAR_TEXT_LABEL = /clear text/i;
const sampleQuery = 'hello';

const onSubmit = jest.fn();

function renderSUT() {
  renderElement(<SearchInput onSubmit={onSubmit} />);
}

function getSearchInput(): HTMLElement {
  return getByPlaceholderText(SEARCH_INPUT_PLACEHOLDER_TEXT);
}

async function typeSampleQueryOnInput() {
  await typeText(sampleQuery, getSearchInput());
}

async function pressEnterOnInput() {
  await typeText('{enter}', getSearchInput());
}

afterEach(() => jest.clearAllMocks());

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

test('does not submit if query is empty text', async () => {
  renderSUT();

  await pressEnterOnInput();

  expect(onSubmit).not.toHaveBeenCalled();
});

test('submits on "enter"', async () => {
  renderSUT();

  await typeSampleQueryOnInput();
  await pressEnterOnInput();

  expect(onSubmit).toHaveBeenCalledTimes(1);
  expect(onSubmit).toHaveBeenCalledWith(sampleQuery);
});
