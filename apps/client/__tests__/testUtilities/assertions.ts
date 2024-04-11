import { queryErrorComponent, querySpinner } from './queries';

export function assertErrorIsNotShown() {
  expect(queryErrorComponent()).not.toBeInTheDocument();
}

export function assertSpinnerIsNotShown() {
  expect(querySpinner()).not.toBeInTheDocument();
}
