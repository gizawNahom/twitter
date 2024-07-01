import { ByRoleMatcher, ByRoleOptions, screen } from '@testing-library/react';
import { SEARCH_INPUT_PLACEHOLDER_TEXT } from './texts';

export function getByPlaceholderText(text: string | RegExp): HTMLElement {
  return screen.getByPlaceholderText(text);
}

export function getSearchInput(): HTMLElement {
  return getByPlaceholderText(SEARCH_INPUT_PLACEHOLDER_TEXT);
}

export function getByText(text: string | RegExp): HTMLElement {
  return screen.getByText(text);
}

export function getByTestId(testId: string): HTMLElement {
  return screen.getByTestId(testId);
}

export function getByRole(
  role: ByRoleMatcher,
  options?: ByRoleOptions | undefined
) {
  return screen.getByRole(role, options);
}
