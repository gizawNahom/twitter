import { waitFor, screen } from '@testing-library/react';
import { userSelected } from '../../../../lib/redux';
import Chat from '../../../../pages/messages/chat';
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
import { MESSAGES } from '../../../testUtilities/routes';
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
    const message = 'test';

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
      expect(screen.queryByText(message)).not.toBeInTheDocument();
    });

    describe('When the user sends a message', () => {
      let isChatCreationFailure: boolean;

      beforeEach(async () => {
        if (isChatCreationFailure) server.use(genericErrorHandler);
        await typeAndClickSend(message);
      });

      afterEach(() => (isChatCreationFailure = false));

      describe('And chat creation is successful', () => {
        async function assertMessageIsDisplayed() {
          await waitFor(() => expect(getByText(message)).toBeInTheDocument());
          expect(screen.queryByText(NO_MESSAGES_TEXT)).not.toBeInTheDocument();
        }

        function assertASingleApiCallToGetOrCreateChat() {
          expect(getOrCreateChatCalls).toHaveLength(1);
          expect(getOrCreateChatCalls[0]).toStrictEqual({
            username: sampleUserResponse.username,
          });
        }

        test(`Then the message is displayed
              And there is a single api call to ${Operations.GetOrCreateChat}`, async () => {
          await assertMessageIsDisplayed();
          assertASingleApiCallToGetOrCreateChat();
        });
      });

      describe('But chat creation is not successful', () => {
        beforeEach(() => {
          isChatCreationFailure = true;
        });

        test('Then the message is not displayed', async () => {
          expect(screen.queryByText(message)).not.toBeInTheDocument();
          expect(getByText(NO_MESSAGES_TEXT)).toBeInTheDocument();
        });
      });

      describe('And the message is sent successfully', () => {
        test(`And there is a single api call to ${Operations.SendMessage}`, async () => {
          expect(sendMessageCalls).toHaveLength(1);
          expect(sendMessageCalls[0]).toStrictEqual({
            text: message,
            chatId: sampleChatResponse.id,
          });
        });
      });
    });
  });
});
