import { App } from '../../components/app';
import { NAV_TEST_ID, POST_FAB_TEST_ID } from '../testUtilities/testIds';
import {
  pressEnterOnInput,
  renderElement,
  typeQueryOnSearchInput,
} from '../testUtilities/helpers';
import { setUpMockRouter, getByTestId, getByText } from '../testUtilities';
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
