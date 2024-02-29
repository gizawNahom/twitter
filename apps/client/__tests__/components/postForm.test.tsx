import { screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { server } from '../../mocks/server';
import { genericErrorHandler, wasCreatePostCalled } from '../../mocks/handlers';
import { renderElement, setUpApi } from '../testUtilities/helpers';
import { PostForm } from '../../components/postForm';
import { POST_INPUT_PLACE_HOLDER_TEXT } from '../testUtilities/texts';

const POST_BUTTON_TEXT = /^post$/i;
const ERROR_MESSAGE = 'Something went wrong';

const validText = generateRandomString(280);
const tooLongText = validText + '.';

function renderSUT() {
  renderElement(<PostForm />);
}

function queryPostButton() {
  return queryByText(POST_BUTTON_TEXT);
}

function queryByText(text: string | RegExp) {
  return screen.queryByText(text);
}

async function typeText(text: string) {
  await userEvent.type(screen.getByRole('textbox'), text);
}

function clickPostButton() {
  return userEvent.click(screen.getByText(POST_BUTTON_TEXT));
}

function assertEmptyInput() {
  const input = screen.queryByPlaceholderText(POST_INPUT_PLACE_HOLDER_TEXT);
  assertVisibility(input);
  expect(input?.getAttribute('value')).toBe('');
}

function assertErrorMessageIsNotDisplayed() {
  expect(queryByText(ERROR_MESSAGE)).toBeNull();
}

function assertPostButtonIsDisabled() {
  const postButton = queryPostButton();
  expect(postButton).toBeDisabled();
  assertVisibility(postButton);
}

function assertVisibility(element: HTMLElement | null) {
  expect(element).toBeVisible();
}

function assertRequestWasNotMade() {
  expect(wasCreatePostCalled).toBe(false);
}

function generateRandomString(length: number) {
  const result = [];
  const characters =
    'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
  const charactersLength = characters.length;
  for (let i = 0; i < length; i++) {
    result.push(
      characters.charAt(Math.floor(Math.random() * charactersLength))
    );
  }
  return result.join('');
}

beforeEach(() => {
  renderSUT();
});

setUpApi();

test('Initial state', () => {
  assertEmptyInput();
  assertPostButtonIsDisabled();
  assertErrorMessageIsNotDisplayed();
});

test("empty post doesn't trigger a request", async () => {
  await clickPostButton();

  assertRequestWasNotMade();
  assertPostButtonIsDisabled();
});

describe("invalid characters don't trigger a request", () => {
  test.each([['{enter}'], ['{tab}'], ['{space}'], [tooLongText]])(
    'when the input is %s',
    async (invalidText) => {
      await typeText(invalidText);
      await clickPostButton();

      assertRequestWasNotMade();
      assertPostButtonIsDisabled();
    },
    10000
  );
});

test('error state', async () => {
  server.use(genericErrorHandler);

  await typeText(validText);
  await clickPostButton();

  await screen.findByText(ERROR_MESSAGE);
  const postButton = queryPostButton();
  expect(postButton).not.toBeDisabled();
}, 10000);

test('loading state', async () => {
  await typeText(validText);
  await clickPostButton();

  await waitFor(() => assertPostButtonIsDisabled());
  assertErrorMessageIsNotDisplayed();
}, 10000);

test('success state', async () => {
  await typeText(validText);
  await clickPostButton();

  assertPostButtonIsDisabled();
  assertErrorMessageIsNotDisplayed();
  await waitFor(() => assertEmptyInput());
}, 10000);
