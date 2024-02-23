import { renderElement } from '../testUtilities/helpers';
import Home from '../../pages/home';
import { screen } from '@testing-library/react';
import { POST_FORM_TEST_ID } from '../testUtilities/testIds';

test('renders PostForm', () => {
  renderElement(<Home />);

  expect(screen.getByTestId(POST_FORM_TEST_ID)).toBeVisible();
});
