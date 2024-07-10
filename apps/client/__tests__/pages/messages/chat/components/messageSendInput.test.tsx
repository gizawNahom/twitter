import { MessageSendInput } from '../../../../../pages/messages/chat';
import {
  renderElement,
  getByPlaceholderText,
  getByRole,
  typeText,
  clickElement,
} from '../../../../testUtilities';
import { screen } from '@testing-library/react';

const onSend = jest.fn();

function getMessageInput(): HTMLElement {
  return getByPlaceholderText(/start a new message/i);
}

function assertSendButtonIsDisabled() {
  expect(getSendButton()).toBeDisabled();
}

function getSendButton(): HTMLElement {
  return getByRole('button', { name: /send/i });
}

describe('Given the component is rendered', () => {
  beforeEach(() => {
    renderElement(<MessageSendInput onSend={onSend} />);
  });

  test('Then static elements are rendered', () => {
    expect(getMessageInput()).toBeInTheDocument();
    assertSendButtonIsDisabled();
  });

  describe('When user types white space', () => {
    beforeEach(async () => {
      await typeText(' ', getMessageInput());
    });

    test('Then send button remains disabled', async () => {
      assertSendButtonIsDisabled();
    });
  });

  describe('When user surrounds characters with white space', () => {
    const sampleText = 'sample';

    beforeEach(async () => {
      await typeText(' ' + sampleText + ' ', getMessageInput());
    });

    describe('And user clicks the send button', () => {
      beforeEach(async () => {
        await clickElement(getSendButton());
      });

      test(`Then the message is stripped from white space
            And the input is cleared`, () => {
        expect(onSend).toHaveBeenCalledTimes(1);
        expect(onSend).toHaveBeenCalledWith(sampleText);
        expect(screen.queryByDisplayValue(sampleText)).not.toBeInTheDocument();
      });
    });
  });
});
