import { Message } from '../../src/core/entities/message';
import { MessageSender } from '../../src/core/ports/messageSender';

export class MessageSenderSpy implements MessageSender {
  isRecipientAvailableResponse = true;
  isRecipientAvailableCalls: { userId: string }[] = [];
  sendMessageCalls: { message: Message; recipientUserId: string }[] = [];

  async isRecipientAvailable(userId: string): Promise<boolean> {
    this.isRecipientAvailableCalls.push({ userId });
    return this.isRecipientAvailableResponse;
  }

  async sendMessage(message: Message, recipientUserId: string) {
    this.sendMessageCalls.push({ message, recipientUserId });
  }
}
