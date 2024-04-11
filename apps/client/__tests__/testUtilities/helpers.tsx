import { Provider } from 'react-redux';
import { reducer } from '../../lib/redux/rootReducer';
import { configureStore } from '@reduxjs/toolkit';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { POST_BUTTON_TEXT, SEARCH_INPUT_PLACEHOLDER_TEXT } from './texts';
import { samplePostResponse } from '../../mocks/values';

export function createSamplePost() {
  return {
    id: samplePostResponse.id,
    text: samplePostResponse.text,
    userId: samplePostResponse.userId,
    createdAt: new Date(samplePostResponse.createdAt),
  };
}

export function renderElement(element: JSX.Element, store = createNewStore()) {
  render(<Provider store={store}>{element}</Provider>);
}

export function createNewStore() {
  return configureStore({
    reducer,
    middleware: (getDefaultMiddleware) => {
      return getDefaultMiddleware({
        serializableCheck: false,
      });
    },
  });
}

export async function typeText(
  text: string,
  element = screen.getByRole('textbox')
) {
  await userEvent.type(element, text);
}

export function clickPostButton() {
  return clickElement(getByText(POST_BUTTON_TEXT));
}

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

export async function typeQueryOnSearchInput(query: string) {
  await typeText(query, getSearchInput());
}

export async function pressEnterOnInput() {
  await typeText('{enter}', getSearchInput());
}

export async function clickElement(element: HTMLElement) {
  await userEvent.click(element);
}
