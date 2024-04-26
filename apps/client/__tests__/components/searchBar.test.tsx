import { screen } from '@testing-library/react';
import { SearchBar } from '../../components/searchBar';
import {
  clickElement,
  getSearchInput,
  pressEnterOnInput,
  renderElement,
  typeQueryOnSearchInput,
} from '../testUtilities';
import { sampleQuery } from '../../mocks/values';

const CLEAR_TEXT_LABEL = /clear text/i;

const onSubmit = jest.fn();

function renderSUT() {
  renderElement(<SearchBar onSubmit={onSubmit} />);
}

afterEach(() => jest.clearAllMocks());

test('initial', () => {
  renderSUT();

  expect(getSearchInput()).toBeInTheDocument();
  expect(screen.queryByLabelText(CLEAR_TEXT_LABEL)).not.toBeInTheDocument();
});

test('clears text', async () => {
  renderSUT();

  await typeQueryOnSearchInput(sampleQuery);
  await clickElement(screen.getByLabelText(CLEAR_TEXT_LABEL));

  expect(screen.queryByDisplayValue(sampleQuery)).not.toBeInTheDocument();
});

test('clearing text does not remove focus from the input', async () => {
  renderSUT();

  await typeQueryOnSearchInput(sampleQuery);
  await clickElement(screen.getByLabelText(CLEAR_TEXT_LABEL));

  expect(getSearchInput()).toHaveFocus();
});

test('does not submit if query is empty text', async () => {
  renderSUT();

  await pressEnterOnInput();

  expect(onSubmit).not.toHaveBeenCalled();
});

test('submits on "enter"', async () => {
  renderSUT();

  await typeQueryOnSearchInput(sampleQuery);
  await pressEnterOnInput();

  expect(onSubmit).toHaveBeenCalledTimes(1);
  expect(onSubmit).toHaveBeenCalledWith(sampleQuery);
});
