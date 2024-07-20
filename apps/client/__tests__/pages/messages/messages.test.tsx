import { screen, waitFor } from '@testing-library/react';
import chatsDB from '../../../test/data/chats';
import Messages from '../../../lib/messages/presentation/pages/messages';
import {
  COMPOSE_MESSAGE_FAB_TEST_ID,
  getByTestId,
  getByRole,
  renderElement,
  MESSAGES_COMPOSE,
  getByText,
  setUpApi,
} from '../../testUtilities';
import { buildChat } from '../../../test/generator';

const WELCOME_TEXT = /welcome to your inbox!/i;
const WRITE_TEXT = /write a message/i;

const welcomeTextFinder: [string, object] = ['heading', { name: WELCOME_TEXT }];
const writeTextFinder: [string, object] = ['link', { name: WRITE_TEXT }];

setUpApi();

describe('Given the user has navigated to the page', () => {
  describe('And the user has no chats', () => {
    beforeEach(() => {
      renderElement(<Messages />);
    });

    function assertPlaceholdersAreDisplayed() {
      expect(getByRole(...welcomeTextFinder)).toBeInTheDocument();
      expect(getByRole(...writeTextFinder)).toHaveAttribute(
        'href',
        MESSAGES_COMPOSE
      );
    }

    test('Then the initial elements are displayed', () => {
      expect(getByRole('heading', { name: /messages/i }));
      expect(getByTestId(COMPOSE_MESSAGE_FAB_TEST_ID)).toBeInTheDocument();
      assertPlaceholdersAreDisplayed();
    });
  });

  describe('And the user has chats', () => {
    const chat = buildChat();

    beforeEach(async () => {
      await chatsDB.create(chat);
      renderElement(<Messages />);
    });

    async function assertPlaceholdersAreNotDisplayed() {
      await waitFor(() => {
        expect(
          screen.queryByRole(...welcomeTextFinder)
        ).not.toBeInTheDocument();
      });
      expect(screen.queryByRole(...writeTextFinder)).not.toBeInTheDocument();
    }

    function assertChatsAreDisplayed() {
      expect(getByText(chat.participant.displayName)).toBeInTheDocument();
      expect(getByRole('img')).toHaveAttribute(
        'src',
        expect.stringMatching(encodeURIComponent(chat.participant.profilePic))
      );
    }

    test(`
      Then placeholder elements are not displayed
      And chats are displayed
      `, async () => {
      await assertPlaceholdersAreNotDisplayed();
      assertChatsAreDisplayed();
    });
  });
});
