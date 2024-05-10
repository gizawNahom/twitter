import { MessageGateway } from '../../src/core/ports/messageGateway';

export class MessageGatewayFailureStub implements MessageGateway {
  saveMessage(): Promise<void> {
    throw new Error('Failed');
  }

  async doesChatExist(): Promise<boolean> {
    throw new Error('Failed');
  }

  getCorrespondentId(): Promise<string> {
    throw new Error('Failed');
  }
}
