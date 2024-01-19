import { renderElement } from '../utilities/helpers';
import Home from '../../pages/home';
import { screen } from '@testing-library/react';

test('renders PostForm', () => {
  renderElement(<Home />);

  expect(screen.getByTestId('post-input')).toBeVisible();
});
