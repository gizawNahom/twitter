import { App } from '../../components/app';
import { NAV_TEST_ID, POST_FAB_TEST_ID } from '../testUtilities/testIds';
import {
  getSearchInput,
  renderElement,
  setUpMockRouter,
  typeText,
} from '../testUtilities/helpers';
import { screen } from '@testing-library/react';

jest.mock('next/router', () => ({
  useRouter: jest.fn().mockImplementation(() => ({
    pathname: '/path',
  })),
}));

const sampleQuery = 'hello';

const push = jest.fn();

const sampleText = 'test';

function renderSUT() {
  renderElement(
    <App>
      <div>{sampleText}</div>
    </App>
  );
}

async function typeSampleQueryOnInput() {
  await typeText(sampleQuery, getSearchInput());
}

async function pressEnterOnInput() {
  await typeText('{enter}', getSearchInput());
}

setUpMockRouter({ push });

test('initial', () => {
  renderSUT();

  expect(screen.getByTestId(NAV_TEST_ID)).toBeVisible();
  expect(screen.getByText(sampleText)).toBeVisible();
  expect(screen.getByTestId(POST_FAB_TEST_ID)).toBeVisible();
});

test('search input pushes to search page on "enter"', async () => {
  renderSUT();

  await typeSampleQueryOnInput();
  await pressEnterOnInput();

  expect(push).toHaveBeenCalledTimes(1);
  expect(push).toHaveBeenCalledWith(`/search?q=${sampleQuery}`);
});
