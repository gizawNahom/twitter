import { App } from '../../components/app';
import {
  setUpMockRouter,
  getByTestId,
  getByText,
  pressEnterOnInput,
  renderElement,
  typeQueryOnSearchInput,
  NAV_TEST_ID,
  POST_FAB_TEST_ID,
} from '../testUtilities';
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

setUpMockRouter({ push, pathname: '/test' });

test('initial', () => {
  renderSUT();

  expect(getByTestId(NAV_TEST_ID)).toBeVisible();
  expect(getByText(sampleText)).toBeVisible();
  expect(getByTestId(POST_FAB_TEST_ID)).toBeVisible();
});

test('search input pushes to search page on "enter"', async () => {
  renderSUT();

  await typeQueryOnSearchInput(sampleQuery);
  await pressEnterOnInput();

  expect(push).toHaveBeenCalledTimes(1);
  expect(push).toHaveBeenCalledWith(`/search?q=${sampleQuery}`);
});
