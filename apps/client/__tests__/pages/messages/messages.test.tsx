import { screen, waitFor } from '@testing-library/react';
import chatsDB from '../../../test/data/chats';
import Messages from '../../../lib/messages/ui/pages/messages';
import {
  COMPOSE_MESSAGE_FAB_TEST_ID,
  getByTestId,
  getByRole,
  renderElement,
  MESSAGES_COMPOSE,
  getByText,
  setUpApi,
  querySpinner,
  clickElement,
  waitForErrorToBeInTheDocument,
  setUpMockRouter,
} from '../../testUtilities';
import { buildChat } from '../../../test/generator';
import { server } from '../../../mocks/server';
import { genericErrorHandler } from '../../../mocks/handlers';
import { Chat } from '../../../lib/messages/core/domain/chat';
import { MESSAGES_ROUTE } from '../../../lib/messages/ui/utilities/routes';

jest.mock('next/router', () => ({
  useRouter: jest.fn(),
}));

const WELCOME_TEXT = /welcome to your inbox!/i;
const WRITE_TEXT = /write a message/i;

const welcomeTextFinder: [string, object] = ['heading', { name: WELCOME_TEXT }];
const writeTextFinder: [string, object] = ['link', { name: WRITE_TEXT }];

setUpApi();

describe('Given the user has navigated to the page', () => {
  beforeAll(() => {
    chatsDB.clear();
  });

  async function assertSpinnerIsDisplayedAndRemoved() {
    expect(querySpinner()).toBeInTheDocument();
    await waitFor(() => {
      expect(querySpinner()).not.toBeInTheDocument();
    });
  }

  describe('And the user has no chats', () => {
    beforeEach(() => {
      renderElement(<Messages chatId={''} />);
    });

    function assertPlaceholdersAreDisplayed() {
      expect(getByRole(...welcomeTextFinder)).toBeInTheDocument();
      expect(getByRole(...writeTextFinder)).toHaveAttribute(
        'href',
        MESSAGES_COMPOSE
      );
    }

    test('Then the initial elements are displayed', async () => {
      expect(getByRole('heading', { name: /messages/i }));
      expect(getByTestId(COMPOSE_MESSAGE_FAB_TEST_ID)).toBeInTheDocument();
      await assertSpinnerIsDisplayedAndRemoved();
      assertPlaceholdersAreDisplayed();
    });
  });

  async function assertPlaceholdersAreNotDisplayed() {
    await waitFor(() => {
      expect(screen.queryByRole(...welcomeTextFinder)).not.toBeInTheDocument();
    });
    expect(screen.queryByRole(...writeTextFinder)).not.toBeInTheDocument();
  }

  describe('And the user has chats', () => {
    let chat1: Chat;
    let chat2: Chat;

    const push = jest.fn();

    setUpMockRouter({ push });

    beforeAll(async () => {
      chat1 = await chatsDB.create(buildChat());
      chat2 = await chatsDB.create(buildChat());
    });

    beforeEach(async () => {
      renderElement(<Messages chatId="" />);
    });

    async function assertChatsAreDisplayed() {
      await assertChatIsDisplayed(chat1);
      await assertChatIsDisplayed(chat2);

      async function assertChatIsDisplayed(chat: Chat) {
        const participant = chat.participant;
        const displayName = participant.displayName;
        await waitFor(() => {
          expect(getByText(displayName)).toBeInTheDocument();
        });
        expect(getByText(displayName)).toBeInTheDocument();
        const img = screen.getByAltText(`${displayName}'s profile pic`);
        expect(img).toBeInTheDocument();
        expect(img).toHaveAttribute(
          'src',
          expect.stringMatching(encodeURIComponent(participant.profilePic))
        );
        expect(getByText(displayName).closest('a')).toHaveAttribute(
          'href',
          `${MESSAGES_ROUTE}/${chat.id}`
        );
      }
    }

    test(`
      Then placeholder elements are not displayed
      And chats are displayed
      `, async () => {
      // await assertSpinnerIsDisplayedAndRemoved();
      await assertPlaceholdersAreNotDisplayed();
      await assertChatsAreDisplayed();
    }, 15000);
  });

  describe('And there is an error when fetching chats', () => {
    beforeEach(async () => {
      server.use(genericErrorHandler);
      renderElement(<Messages chatId="" />);
    });

    test('Then error is displayed', async () => {
      await assertSpinnerIsDisplayedAndRemoved();
      await assertPlaceholdersAreNotDisplayed();
      await waitForErrorToBeInTheDocument();
    });
  });
});
