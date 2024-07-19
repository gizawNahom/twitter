import { waitFor, screen, within } from '@testing-library/react';
import { userSelected } from '../../../../lib/redux';
import Chat from '../../../../lib/messages/presentation/pages/chat';
import {
  BACK_BUTTON_TEST_ID,
  createNewStore,
  getByRole,
  getByTestId,
  getByText,
  MESSAGE_SEND_INPUT_TEST_ID,
  Operations,
  renderElement,
  setUpApi,
  setUpMockRouter,
  SPINNER_TEST_ID,
} from '../../../testUtilities';
import { MESSAGES, MESSAGES_CHAT } from '../../../testUtilities/routes';
import {
  sampleChatResponse,
  sampleUserResponse,
} from '../../../../mocks/values';
import { typeAndClickSend } from './components/messageSendInput.test';
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

jest.mock('next/router', () => ({
  useRouter: jest.fn(),
}));

const push = jest.fn();
const NO_MESSAGES_TEXT = /no messages/i;

setUpMockRouter({ push });

setUpApi();

beforeEach(() => {
  getOrCreateChatCalls.splice(0, getOrCreateChatCalls.length);
  sendMessageCalls.splice(0, sendMessageCalls.length);
});

describe('Given user has navigated to the page', () => {
  describe('And user did not select a participant', () => {
    beforeEach(() => {
      renderElement(<Chat />);
    });

    test(`Then user gets redirected to ${MESSAGES}`, () => {
      expect(push).toHaveBeenCalledTimes(1);
      expect(push).toHaveBeenCalledWith(MESSAGES);
    });
  });

  describe('And user has selected a new participant', () => {
    const messageText = 'test';

    beforeEach(() => {
      const store = createNewStore();
      store.dispatch(userSelected(sampleUserResponse));
      renderElement(<Chat />, store);
    });

    test(`Then user does not get redirected to ${MESSAGES}`, () => {
      expect(push).toHaveBeenCalledTimes(0);
    });

    test('Then correct initial elements are displayed', () => {
      expect(getByTestId(BACK_BUTTON_TEST_ID)).toBeInTheDocument();
      expect(getByTestId(MESSAGE_SEND_INPUT_TEST_ID)).toBeInTheDocument();
      expect(getByRole('img')).toHaveAttribute(
        'src',
        expect.stringMatching(encodeURIComponent(sampleUserResponse.profilePic))
      );
      expect(getByText(sampleUserResponse.displayName)).toBeInTheDocument();
      expect(getByText(NO_MESSAGES_TEXT)).toBeInTheDocument();
      expect(screen.queryByRole('log')).not.toBeInTheDocument();
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

        async function assertMessageIsDisplayed() {
          const messageList = await screen.findByRole('log');
          const MESSAGE_TEST_ID = 'message';
          const message = within(messageList).getByTestId(MESSAGE_TEST_ID);

          assertMessageDayIsDisplayed(messageList);
          assertMessageTextAndMessageTimeAreDisplayed(message);
          assertLoadingIsDisplayed(message);
          await assertSuccessIsDisplayed(message);
          expect(screen.queryByText(NO_MESSAGES_TEXT)).not.toBeInTheDocument();

          function assertMessageDayIsDisplayed(messageList: HTMLElement) {
            expect(
              within(messageList).getByText(formatDayForMessage(new Date()))
            ).toBeInTheDocument();
          }

          function assertMessageTextAndMessageTimeAreDisplayed(
            message: HTMLElement
          ) {
            expect(message).toHaveTextContent(messageText);
            expect(message).toHaveTextContent(formatTimeForMessage(new Date()));
          }

          function assertLoadingIsDisplayed(message: HTMLElement) {
            expect(
              within(message).getByTestId(SPINNER_TEST_ID)
            ).toBeInTheDocument();
          }

          async function assertSuccessIsDisplayed(message: HTMLElement) {
            await waitFor(() =>
              expect(
                within(message).queryByTestId(SPINNER_TEST_ID)
              ).not.toBeInTheDocument()
            );
            expect(within(message).getByLabelText('sent')).toBeInTheDocument();
          }
        }

        test(`Then the message is displayed
              And there is a single api call to ${Operations.GetOrCreateChat}
              And the chat id is added to the url
              And the input is cleared`, async () => {
          await assertMessageIsDisplayed();

          assertASingleApiCallToGetOrCreateChat();

          expect(window.location.pathname).toBe(
            MESSAGES_CHAT + `/${sampleChatResponse.id}`
          );

          expect(
            screen.queryByDisplayValue(messageText)
          ).not.toBeInTheDocument();
        });

        describe('And the message is sent successfully', () => {
          test(`Then there is a single api call to ${Operations.SendMessage}`, async () => {
            await waitFor(() => expect(sendMessageCalls).toHaveLength(1));
            expect(sendMessageCalls[0]).toStrictEqual({
              text: messageText,
              chatId: sampleChatResponse.id,
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

      test(`Then is a single api call to ${Operations.GetOrCreateChat}
            Then the messages are displayed
            `, async () => {
        assertASingleApiCallToGetOrCreateChat();

        // const messageList = await screen.findByRole('log');
        // const MESSAGE_TEST_ID = 'message';
        // const messages = within(messageList).getAllByTestId(MESSAGE_TEST_ID);
        // expect(messages).toHaveLength(2);
      });
    });
  });
});
