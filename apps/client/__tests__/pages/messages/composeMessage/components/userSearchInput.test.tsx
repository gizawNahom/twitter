import { waitFor } from '@testing-library/react';
import { UserSearchInput } from '../../../../../lib/messages/ui/pages/composeMessage';
import {
  getByPlaceholderText,
  renderElement,
  typeText,
} from '../../../../testUtilities';
import { useState } from 'react';

const onThrottledChange = jest.fn();
const TYPING_DELAY = 200;

function renderSUT() {
  renderElement(<Container />);

  function Container() {
    const [value, setValue] = useState<string>('');

    return (
      <UserSearchInput
        onThrottledChange={onThrottledChange}
        searchInputValue={value}
        setSearchInputValue={setValue}
      />
    );
  }
}

export async function typeOnInput(characters: string) {
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

  expect(onThrottledChange).toHaveBeenCalledTimes(1);
  expect(onThrottledChange).toHaveBeenCalledWith(character);
});

test('does not notify when the input is whitespace', async () => {
  renderSUT();

  await typeOnInput(' ');

  expect(onThrottledChange).toHaveBeenCalledTimes(0);
});

test('strips white space before notifying', async () => {
  const character = 'a';
  renderSUT();

  await typeOnInput(' ' + character + ' ');

  expect(onThrottledChange).toHaveBeenCalledWith(character);
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
    expect(onThrottledChange).toHaveBeenCalledTimes(2);
  });
  expect(onThrottledChange.mock.calls[0][0]).toBe(input[0]);
  expect(input.includes(onThrottledChange.mock.calls[1][0])).toBe(true);
});
