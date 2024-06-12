import { Connection } from '../../src/core/entities/connection';
import { Message } from '../../src/core/entities/message';
import { MessageSender } from '../../src/core/ports/messageSender';

export class MessageSenderSpy implements MessageSender {
  isCorrespondentAvailableResponse = true;
  isCorrespondentAvailableCalls: { userId: string }[] = [];
  sendMessageCalls: { message: Message; recipientUserId: string }[] = [];
  makeCorrespondentAvailableCalls: {
    connection: Connection;
    correspondentUserId: string;
  }[] = [];

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

  async makeCorrespondentAvailable(
    connection: Connection,
    correspondentUserId: string
  ): Promise<void> {
    this.makeCorrespondentAvailableCalls.push({
      connection,
      correspondentUserId,
    });
  }
}
