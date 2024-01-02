import { screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { server } from '../../mocks/server';
import { errorHandler, wasCreatePostCalled } from '../../mocks/handlers';
import {
  addNewStore,
  renderElement,
  setUpClient,
  setUpMSW,
} from '../utilities';
import { PostInput } from '../../components/postInput';

const POST_BUTTON_TEXT = /^post$/i;
const ERROR_MESSAGE = 'Something went wrong';
const INPUT_PLACE_HOLDER = "What's happening?";
const SUCCESS_MESSAGE = 'Your post was sent.';

const validText = generateRandomString(280);
const tooLongText = validText + '.';

function renderSUT() {
  renderElement(addNewStore(<PostInput />));
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
  const input = screen.queryByPlaceholderText(INPUT_PLACE_HOLDER);
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

setUpMSW();

setUpClient();

test('Initial state', () => {
  assertEmptyInput();
  assertPostButtonIsDisabled();
  assertErrorMessageIsNotDisplayed();
  expect(queryByText(SUCCESS_MESSAGE)).toBeNull();
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
  server.use(errorHandler);

  await typeText(validText);
  await clickPostButton();

  await screen.findByText(ERROR_MESSAGE);
  const postButton = queryPostButton();
  expect(postButton).not.toBeDisabled();
}, 10000);

test('loading state', async () => {
  await typeText(validText);
  await clickPostButton();

  assertPostButtonIsDisabled();
  assertErrorMessageIsNotDisplayed();
}, 10000);

test('success state', async () => {
  await typeText(validText);
  await clickPostButton();

  assertPostButtonIsDisabled();
  assertErrorMessageIsNotDisplayed();
  await screen.findByText(SUCCESS_MESSAGE);
  assertEmptyInput();
}, 10000);
