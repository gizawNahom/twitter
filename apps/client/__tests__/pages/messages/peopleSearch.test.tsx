import { waitFor } from '@testing-library/react';
import { PeopleSearch } from '../../../pages/messages/compose';
import {
  getByPlaceholderText,
  renderElement,
  typeText,
} from '../../testUtilities';

const onChange = jest.fn();
const TYPING_DELAY = 200;

function renderSUT() {
  renderElement(<PeopleSearch onChange={onChange} />);
}

async function typeOnInput(characters: string) {
  await typeText(characters, getSearchPeopleInput());
}

function getSearchPeopleInput(): HTMLElement {
  return getByPlaceholderText(/search people/i);
}

afterEach(() => jest.clearAllMocks());

test('initial', () => {
  renderSUT();

  expect(getSearchPeopleInput()).toBeInTheDocument();
});

test('notifies on input change', async () => {
  const character = 'a';
  renderSUT();

  await typeOnInput(character);

  expect(onChange).toHaveBeenCalledTimes(1);
  expect(onChange).toHaveBeenCalledWith(character);
});

test('does not notify when the input is whitespace', async () => {
  renderSUT();

  await typeOnInput(' ');

  expect(onChange).toHaveBeenCalledTimes(0);
});

test('strips white space before notifying', async () => {
  const character = 'a';
  renderSUT();

  await typeOnInput(' ' + character + ' ');

  expect(onChange).toHaveBeenCalledWith(character);
});

test('throttles input change notification', async () => {
  const input = 'sample input';
  renderSUT();

  await typeOnInput(input[0]);
  await new Promise((resolve, _) => {
    setTimeout(resolve, TYPING_DELAY);
  });
  await typeOnInput(input.substring(1));

  await waitFor(() => {
    expect(onChange).toHaveBeenCalledTimes(2);
  });
  expect(onChange.mock.calls[0][0]).toBe(input[0]);
  expect(input.includes(onChange.mock.calls[1][0])).toBe(true);
});
