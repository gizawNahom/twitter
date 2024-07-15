import { waitFor, screen, within } from '@testing-library/react';
import { userSelected } from '../../../../lib/redux';
import Chat from '../../../../pages/messages/chat/[[...chatId]]';
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
import { formatTimeForMessage } from '../../../../utilities/formatTimeForMessage';
import { formatDayForMessage } from '../../../../utilities/formatDayForMessage';

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

    describe('When the user sends a message', () => {
      describe('And chat creation is successful', () => {
        beforeEach(async () => {
          await typeAndClickSend(messageText);
        });

        async function assertMessageIsDisplayed() {
          const messageList = await screen.findByRole('log');

          expect(
            within(messageList).getByText(formatDayForMessage(new Date()))
          ).toBeInTheDocument();

          const MESSAGE_TEST_ID = 'message';
          const message = within(messageList).getByTestId(MESSAGE_TEST_ID);
          expect(message).toHaveTextContent(messageText);
          expect(message).toHaveTextContent(formatTimeForMessage(new Date()));

          expect(screen.queryByText(NO_MESSAGES_TEXT)).not.toBeInTheDocument();
        }

        function assertASingleApiCallToGetOrCreateChat() {
          expect(getOrCreateChatCalls).toHaveLength(1);
          expect(getOrCreateChatCalls[0]).toStrictEqual({
            username: sampleUserResponse.username,
          });
        }

        test(`Then the message is displayed
              And there is a single api call to ${Operations.GetOrCreateChat}
              And the chat id is added to the url`, async () => {
          await assertMessageIsDisplayed();

          assertASingleApiCallToGetOrCreateChat();

          expect(window.location.pathname).toBe(
            MESSAGES_CHAT + `/${sampleChatResponse.id}`
          );
        });

        describe('And the message is sent successfully', () => {
          test(`And there is a single api call to ${Operations.SendMessage}`, async () => {
            expect(sendMessageCalls).toHaveLength(1);
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
  });
});
