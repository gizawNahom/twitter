import { screen } from '@testing-library/react';
import { samplePostResponse } from '../../mocks/values';
import { ERROR_TEST_ID, SPINNER_TEST_ID } from './testIds';

export function querySamplePostTime(options: Intl.DateTimeFormatOptions) {
  const postTime = screen.queryByText(
    new Intl.DateTimeFormat('en-US', options).format(
      new Date(samplePostResponse.createdAt)
    )
  );
  return postTime;
}

export function queryPostTime() {
  const options: Intl.DateTimeFormatOptions = {
    hour: 'numeric',
    minute: 'numeric',
    day: 'numeric',
    month: 'short',
    year: 'numeric',
  };
  const postTime = screen.queryByText(
    new Intl.DateTimeFormat('en-US', options).format(
      new Date(samplePostResponse.createdAt)
    )
  );
  return postTime;
}

export function queryErrorComponent(): HTMLElement | null {
  return queryByTestId(ERROR_TEST_ID);
}

export function querySpinner(): HTMLElement | null {
  return queryByTestId(SPINNER_TEST_ID);
}

export function queryByTestId(testId: string): HTMLElement | null {
  return screen.queryByTestId(testId);
}
