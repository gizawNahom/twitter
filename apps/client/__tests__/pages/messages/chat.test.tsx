import { userSelected } from '../../../lib/redux/';
import Chat from '../../../pages/messages/chat';
import {
  BACK_BUTTON_TEST_ID,
  createNewStore,
  getByPlaceholderText,
  getByRole,
  getByTestId,
  getByText,
  renderElement,
  setUpMockRouter,
} from '../../testUtilities';
import { MESSAGES } from '../../testUtilities/routes';
import { sampleUserResponse } from '../../../mocks/values';

jest.mock('next/router', () => ({
  useRouter: jest.fn(),
}));

const push = jest.fn();

setUpMockRouter({ push });

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

  describe('And user has selected a participant', () => {
    beforeEach(() => {
      const store = createNewStore();
      store.dispatch(userSelected(sampleUserResponse));
      renderElement(<Chat />, store);
    });

    test(`Then user does not get redirected to ${MESSAGES}`, () => {
      expect(push).toHaveBeenCalledTimes(0);
    });

    test('Then static elements are displayed', () => {
      expect(getByTestId(BACK_BUTTON_TEST_ID)).toBeInTheDocument();
      expect(getByPlaceholderText(/start a new message/i)).toBeInTheDocument();
      expect(getByRole('button', { name: /send/i })).toBeDisabled();
      expect(getByRole('img')).toHaveAttribute(
        'src',
        expect.stringMatching(encodeURIComponent(sampleUserResponse.profilePic))
      );
      expect(getByText(sampleUserResponse.displayName)).toBeInTheDocument();
    });
  });
});
