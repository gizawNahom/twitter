import { screen } from '@testing-library/react';
import { Spinner } from '../../components/spinner';
import { renderElement } from '../testUtilities/helpers';

const LOADING = /loading/i;

function queryLoading(): HTMLElement | null {
  return screen.queryByText(LOADING);
}

test('renders loading', () => {
  renderElement(<Spinner />);

  expect(queryLoading()).toBeInTheDocument();
});
