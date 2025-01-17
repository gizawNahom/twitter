import { useState } from 'react';
import { MessageSendInput } from '../../../../../lib/messages/ui/pages/chat';
import {
  renderElement,
  getByPlaceholderText,
  getByRole,
  typeText,
  clickElement,
  pressEnterOnInput,
} from '../../../../testUtilities';

const onSend = jest.fn();

export async function typeAndClickSend(message: string) {
  await typeText(message, getMessageInput());
  await clickElement(getSendButton());
}

export function getMessageInput(): HTMLElement {
  return getByPlaceholderText(/start a new message/i);
}

function assertSendButtonIsDisabled() {
  expect(getSendButton()).toBeDisabled();
}

function getSendButton(): HTMLElement {
  return getByRole('button', { name: /send/i });
}

afterEach(() => jest.clearAllMocks());

describe('Given the component is rendered', () => {
  beforeEach(() => {
    renderElement(<Container />);

    function Container() {
      const [messageInput, setMessageInput] = useState<string>('');

      return (
        <MessageSendInput
          onSend={onSend}
          messageInput={messageInput}
          onChange={setMessageInput}
        />
      );
    }
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

      test(`Then the message is stripped from white space`, () => {
        expect(onSend).toHaveBeenCalledTimes(1);
        expect(onSend).toHaveBeenCalledWith(sampleText);
      });
    });
  });

  describe('When the user types text', () => {
    const sampleText = 'sample';

    beforeEach(async () => {
      await typeText(sampleText, getMessageInput());
    });

    describe('And clicks enter', () => {
      beforeEach(async () => {
        await pressEnterOnInput(getMessageInput());
      });

      test('Then the message is sent', () => {
        expect(onSend).toHaveBeenCalledTimes(1);
        expect(onSend).toHaveBeenCalledWith(sampleText);
      });
    });
  });
});
