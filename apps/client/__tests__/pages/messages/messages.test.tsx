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
  querySpinner,
  queryErrorComponent,
} from '../../testUtilities';
import { buildChat } from '../../../test/generator';
import { server } from '../../../mocks/server';
import { genericErrorHandler } from '../../../mocks/handlers';

const WELCOME_TEXT = /welcome to your inbox!/i;
const WRITE_TEXT = /write a message/i;

const welcomeTextFinder: [string, object] = ['heading', { name: WELCOME_TEXT }];
const writeTextFinder: [string, object] = ['link', { name: WRITE_TEXT }];

setUpApi();

describe('Given the user has navigated to the page', () => {
  async function assertSpinnerIsDisplayedAndRemoved() {
    expect(querySpinner()).toBeInTheDocument();
    await waitFor(() => {
      expect(querySpinner()).not.toBeInTheDocument();
    });
  }

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
    const chat = buildChat();

    beforeEach(async () => {
      await chatsDB.create(chat);
      renderElement(<Messages />);
    });

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
      await assertSpinnerIsDisplayedAndRemoved();
      await assertPlaceholdersAreNotDisplayed();
      assertChatsAreDisplayed();
    });
  });

  describe('And there is error when fetching chats', () => {
    beforeEach(async () => {
      server.use(genericErrorHandler);
      renderElement(<Messages />);
    });

    test('Then error is displayed', async () => {
      await assertSpinnerIsDisplayedAndRemoved();
      await assertPlaceholdersAreNotDisplayed();
      await waitFor(() => {
        expect(queryErrorComponent()).toBeInTheDocument();
      });
    });
  });
});
