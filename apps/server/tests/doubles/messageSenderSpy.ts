import { Message } from '../../src/core/entities/message';
import { MessageSender } from '../../src/core/ports/messageSender';

export class MessageSenderSpy implements MessageSender {
  isCorrespondentAvailableResponse = true;
  isCorrespondentAvailableCalls: { userId: string }[] = [];
  sendMessageCalls: { message: Message; recipientUserId: string }[] = [];

  async isCorrespondentAvailable(
    correspondentUserId: string
  ): Promise<boolean> {
    this.isCorrespondentAvailableCalls.push({ userId: correspondentUserId });
    return this.isCorrespondentAvailableResponse;
  }

  async sendMessage(message: Message, correspondentUserId: string) {
    this.sendMessageCalls.push({
      message,
      recipientUserId: correspondentUserId,
    });
  }

  makeCorrespondentAvailable(): Promise<void> {
    throw new Error('Method not implemented.');
  }
}
