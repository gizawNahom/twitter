import { App } from '../../components/app';
import { NAV_TEST_ID, POST_FAB_TEST_ID } from '../utilities/testIds';
import { renderElement } from '../utilities/helpers';
import { screen } from '@testing-library/react';

jest.mock('next/router', () => ({
  useRouter: jest.fn().mockImplementation(() => ({
    pathname: '/path',
  })),
}));

test('initial', () => {
  const sampleText = 'test';

  renderElement(
    <App>
      <div>{sampleText}</div>
    </App>
  );

  expect(screen.getByTestId(NAV_TEST_ID)).toBeVisible();
  expect(screen.getByText(sampleText)).toBeVisible();
  expect(screen.getByTestId(POST_FAB_TEST_ID)).toBeVisible();
});
