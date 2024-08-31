import { waitFor, screen, within } from '@testing-library/react';
import { ReduxStore, userSelected } from '../../../../lib/redux';
import Chat from '../../../../lib/messages/presentation/pages/chat';
import {
  BACK_BUTTON_TEST_ID,
  createNewStore,
  getByRole,
  getByTestId,
  getByText,
  MESSAGE_SEND_INPUT_TEST_ID,
  MESSAGE_TEST_ID,
  mockRouter,
  Operations,
  renderElement,
  setUpApi,
  SPINNER_TEST_ID,
} from '../../../testUtilities';
import { MESSAGES, MESSAGES_CHAT } from '../../../testUtilities/routes';
import {
  sampleChatResponse,
  sampleUserResponse,
} from '../../../../mocks/values';
import {
  getMessageInput,
  typeAndClickSend,
} from './components/messageSendInput.test';
import {
  genericErrorHandler,
  getOrCreateChatCalls,
  sendMessageCalls,
} from '../../../../mocks/handlers';
import { server } from '../../../../mocks/server';
import {
  formatTimeForMessage,
  formatDayForMessage,
} from '../../../../lib/messages/presentation/utilities';
import messagesDB from '../../../../test/data/messages';
import { buildMessage } from '../../../../test/generator';
import { Message } from '../../../../lib/messages/core/domain/message';

jest.mock('next/router', () => ({
  useRouter: jest.fn(),
}));

const NO_MESSAGES_TEXT = /no messages/i;
const messageText = 'test';
const chatId = sampleChatResponse.id;

function renderSUT(store?: ReduxStore) {
  renderElement(<Chat />, store);
}

function assertInitialElementsAreDisplayed() {
  expect(getByTestId(BACK_BUTTON_TEST_ID)).toBeInTheDocument();
  expect(getByTestId(MESSAGE_SEND_INPUT_TEST_ID)).toBeInTheDocument();
  expect(getByText(NO_MESSAGES_TEXT)).toBeInTheDocument();
  expect(screen.queryByRole('log')).not.toBeInTheDocument();
}

async function findMessageList() {
  return await screen.findByRole('log');
}

function assertMessageDayIsDisplayed(
  messageList: HTMLElement,
  day = new Date()
) {
  expect(
    within(messageList).getByText(formatDayForMessage(day))
  ).toBeInTheDocument();
}

function assertNoMessageTextIsNotDisplayed() {
  expect(screen.queryByText(NO_MESSAGES_TEXT)).not.toBeInTheDocument();
}

function assertMessageTextAndMessageTimeAreDisplayed(
  messageElement: HTMLElement,
  message?: { text: string; createdAt: string }
) {
  const { text, createdAt } = message || {
    text: messageText,
    createdAt: new Date().toISOString(),
  };
  expect(messageElement).toHaveTextContent(text);
  expect(messageElement).toHaveTextContent(
    formatTimeForMessage(new Date(createdAt))
  );
}

function assertMessageTickIsDisplayed(messageElement: HTMLElement) {
  expect(within(messageElement).getByLabelText('sent')).toBeInTheDocument();
}

async function assertSentMessageIsDisplayed(message: {
  text: string;
  createdAt: string;
}) {
  const messageList = await findMessageList();
  const messageElement = findMessageElement(messageList, message.text);

  assertMessageDayIsDisplayed(messageList, new Date(message.createdAt));
  assertMessageTextAndMessageTimeAreDisplayed(messageElement, message);
  assertLoadingIsDisplayed(messageElement);
  // await assertSuccessIsDisplayed(messageElement);
  assertNoMessageTextIsNotDisplayed();

  function findMessageElement(messageList: HTMLElement, text: string) {
    const messageElements = getMessageElements(messageList);
    const messageElement = messageElements.find((messageElement) =>
      within(messageElement).queryByText(text)
    ) as HTMLElement;
    return messageElement;
  }
}

function getMessageElements(messageList: HTMLElement) {
  return within(messageList).getAllByTestId(MESSAGE_TEST_ID);
}

function assertLoadingIsDisplayed(message: HTMLElement) {
  expect(within(message).getByTestId(SPINNER_TEST_ID)).toBeInTheDocument();
}

async function assertSuccessIsDisplayed(message: HTMLElement) {
  await waitFor(() =>
    expect(
      within(message).queryByTestId(SPINNER_TEST_ID)
    ).not.toBeInTheDocument()
  );
  assertMessageTickIsDisplayed(message);
}

async function assertASingleApiCallToSendMessage(variables: {
  text: string;
  chatId: string;
}) {
  await waitFor(() => expect(sendMessageCalls).toHaveLength(1));
  expect(sendMessageCalls[0]).toStrictEqual(variables);
}

function assertMessageInputIsCleared() {
  expect(getMessageInput()).toHaveValue('');
}

setUpApi();

beforeEach(() => {
  getOrCreateChatCalls.splice(0, getOrCreateChatCalls.length);
  sendMessageCalls.splice(0, sendMessageCalls.length);
  messagesDB.clear();
});

afterEach(() => jest.resetAllMocks());

describe('Given user has navigated to a new chat page', () => {
  const push = jest.fn();

  beforeEach(() => {
    mockRouter({ push });
  });

  describe('And user did not select a participant', () => {
    beforeEach(() => {
      renderSUT();
    });

    test(`Then user gets redirected to ${MESSAGES}`, () => {
      expect(push).toHaveBeenCalledTimes(1);
      expect(push).toHaveBeenCalledWith(MESSAGES);
    });
  });

  describe('And user has selected a new participant', () => {
    beforeEach(() => {
      const store = createNewStore();
      store.dispatch(userSelected(sampleUserResponse));
      renderSUT(store);
    });

    test(`Then user does not get redirected to ${MESSAGES}`, () => {
      expect(push).toHaveBeenCalledTimes(0);
    });

    test('Then correct initial elements are displayed', () => {
      assertInitialElementsAreDisplayed();
      expect(getByRole('img')).toHaveAttribute(
        'src',
        expect.stringMatching(encodeURIComponent(sampleUserResponse.profilePic))
      );
      expect(getByText(sampleUserResponse.displayName)).toBeInTheDocument();
    });

    function assertASingleApiCallToGetOrCreateChat() {
      expect(getOrCreateChatCalls).toHaveLength(1);
      expect(getOrCreateChatCalls[0]).toStrictEqual({
        username: sampleUserResponse.username,
      });
    }

    describe('When the user sends a message', () => {
      describe('And chat creation is successful', () => {
        beforeEach(async () => {
          await typeAndClickSend(messageText);
        });

        test(`Then the message is displayed
          And there is a single api call to ${Operations.GetOrCreateChat}
          And the chat id is added to the url
          And the input is cleared`, async () => {
          await assertSentMessageIsDisplayed({
            text: messageText,
            createdAt: new Date().toISOString(),
          });

          assertASingleApiCallToGetOrCreateChat();

          expect(window.location.pathname).toBe(MESSAGES_CHAT + `/${chatId}`);

          assertMessageInputIsCleared();
        });

        describe('And the message is sent successfully', () => {
          test(`Then there is a single api call to ${Operations.SendMessage}`, async () => {
            await assertASingleApiCallToSendMessage({
              text: messageText,
              chatId,
            });
          });
        });
      });

      describe('But chat creation is not successful', () => {
        beforeEach(async () => {
          server.use(genericErrorHandler);
          await typeAndClickSend(messageText);
        });

        test(`Then the message is not displayed
              And the message remains on the input`, async () => {
          await waitFor(() =>
            expect(screen.queryByText(messageText)).not.toBeInTheDocument()
          );
          expect(getByText(NO_MESSAGES_TEXT)).toBeInTheDocument();

          expect(screen.getByDisplayValue(messageText)).toBeInTheDocument();
        });
      });
    });

    describe('When the user sends two messages', () => {
      const secondMessageText = `second ${messageText}`;

      beforeEach(async () => {
        await typeAndClickSend(messageText);
        await typeAndClickSend(secondMessageText);
      });

      test(`Then there is a single api call to ${Operations.GetOrCreateChat}
            And the messages are displayed
            And there are two api calls to ${Operations.SendMessage}
            And the message input is cleared
            `, async () => {
        assertASingleApiCallToGetOrCreateChat();
        await assertMessagesAreDisplayed();
        assertTwoSendMessageCalls();
        assertMessageInputIsCleared();

        async function assertMessagesAreDisplayed() {
          const messageList = await findMessageList();
          const messages = getMessageElements(messageList);
          expect(messages).toHaveLength(2);

          assertMessageDayIsDisplayed(messageList);
          await assertMessageIsDisplayed(messages[0]);
          await assertMessageIsDisplayed(messages[1]);
          await waitFor(() => {
            assertNoMessageTextIsNotDisplayed();
          });

          async function assertMessageIsDisplayed(message: HTMLElement) {
            assertMessageTextAndMessageTimeAreDisplayed(message);
            // assertLoadingIsDisplayed(message);
            // await assertSuccessIsDisplayed(message);
          }
        }

        function assertTwoSendMessageCalls() {
          expect(sendMessageCalls).toHaveLength(2);
          expect(sendMessageCalls[0]).toStrictEqual({
            text: messageText,
            chatId,
          });
          expect(sendMessageCalls[1]).toStrictEqual({
            text: secondMessageText,
            chatId,
          });
        }
      });
    });
  });
});

describe('Given the user has navigated to an existing chat', () => {
  const push = jest.fn();
  const chatId = [sampleChatResponse.id];

  beforeEach(() => {
    mockRouter({
      query: {
        chatId,
      },
      push,
    });
  });

  describe('And there are no messages', () => {
    beforeEach(() => {
      renderSUT();
    });

    test('Then initial elements are displayed', () => {
      assertInitialElementsAreDisplayed();
      expect(push).toHaveBeenCalledTimes(0);
    });
  });

  describe('And there are two messages on two separate dates', () => {
    const message1 = buildMessage();
    const message2 = buildMessage();

    beforeEach(async () => {
      await messagesDB.create(chatId[0], message1);
      await messagesDB.create(chatId[0], message2);
      renderSUT();
    });

    test('Then the messages and the dates are displayed', async () => {
      await waitFor(() => assertNoMessageTextIsNotDisplayed());
      await assertMessagesAreDisplayed();

      async function assertMessagesAreDisplayed() {
        const messageList = await findMessageList();
        const messages = getMessageElements(messageList);
        expect(messages).toHaveLength(2);

        assertMessageIsDisplayed(messages[0], message1);
        assertMessageIsDisplayed(messages[1], message2);

        function assertMessageIsDisplayed(
          messageElement: HTMLElement,
          message: Message
        ) {
          assertMessageDayIsDisplayed(messageList, new Date(message.createdAt));
          assertMessageTextAndMessageTimeAreDisplayed(messageElement, message);
          assertMessageTickIsDisplayed(messageElement);
        }
      }
    });

    describe('When the user sends a message', () => {
      beforeEach(async () => {
        await typeAndClickSend(messageText);
      });

      test(`Then there is no call to ${Operations.GetOrCreateChat}
            And message is displayed
            And there is a single api call to ${Operations.SendMessage}
            And message input is cleared
        `, async () => {
        expect(getOrCreateChatCalls).toHaveLength(0);

        await assertSentMessageIsDisplayed({
          text: messageText,
          createdAt: new Date().toISOString(),
        });

        await assertASingleApiCallToSendMessage({
          text: messageText,
          chatId: chatId[0],
        });

        assertMessageInputIsCleared();
      });
    });
  });
});
