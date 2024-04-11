import { App } from '../../components/app';
import { NAV_TEST_ID, POST_FAB_TEST_ID } from '../testUtilities/testIds';
import {
  getByText,
  pressEnterOnInput,
  renderElement,
  setUpMockRouter,
  typeQueryOnSearchInput,
} from '../testUtilities/helpers';
import { screen } from '@testing-library/react';
import { sampleQuery } from '../../mocks/values';

jest.mock('next/router', () => ({
  useRouter: jest.fn().mockImplementation(() => ({
    pathname: '/path',
  })),
}));

const push = jest.fn();

const sampleText = 'test';

function renderSUT() {
  renderElement(
    <App>
      <div>{sampleText}</div>
    </App>
  );
}

setUpMockRouter({ push });

test('initial', () => {
  renderSUT();

  expect(screen.getByTestId(NAV_TEST_ID)).toBeVisible();
  expect(getByText(sampleText)).toBeVisible();
  expect(screen.getByTestId(POST_FAB_TEST_ID)).toBeVisible();
});

test('search input pushes to search page on "enter"', async () => {
  renderSUT();

  await typeQueryOnSearchInput(sampleQuery);
  await pressEnterOnInput();

  expect(push).toHaveBeenCalledTimes(1);
  expect(push).toHaveBeenCalledWith(`/search?q=${sampleQuery}`);
});
