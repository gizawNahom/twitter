import { createWhenText } from '../../utilities/createWhenText';

function createDate(diffInSeconds: number) {
  const date = new Date();
  date.setSeconds(date.getSeconds() - diffInSeconds);
  return date;
}

function getResult(date: Date) {
  return createWhenText(date);
}

test('returns "now" when the difference is less than a minute', () => {
  const result = getResult(createDate(30));

  expect(result).toBe('now');
});

describe('returns minutes when the difference is between a minute and an hour', () => {
  test.each([
    [1, '1 min'],
    [2, '2 mins'],
    [59, '59 mins'],
  ])(
    'when the difference is %s mins',
    async (differenceInMinutes, expectedText) => {
      const result = getResult(createDate(60 * differenceInMinutes));

      expect(result).toBe(expectedText);
    }
  );
});

describe('returns hours when the difference is between an hour and 24 hours', () => {
  test.each([
    [1, '1h'],
    [5, '5h'],
    [23, '23h'],
  ])(
    'when the difference is %s hours',
    async (differenceInHours, expectedText) => {
      const result = getResult(createDate(3600 * differenceInHours));

      expect(result).toBe(expectedText);
    }
  );
});

test('returns "yesterday" when the difference is a day', () => {
  const result = getResult(createDate(3600 * 24));

  expect(result).toBe('yesterday');
});

test('returns day when the difference is more than a day', () => {
  const result = getResult(new Date(2002, 1, 5));

  expect(result).toBe('Feb 5, 2002');
});
