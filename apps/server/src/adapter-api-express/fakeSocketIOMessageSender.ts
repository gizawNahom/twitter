import { Message } from '../core/entities/message';
import { SocketIOConnection } from '../adapter-api-express/socketIOConnection';
import { MessageSender } from '../core/ports/messageSender';

export class FakeSocketIOMessageSender implements MessageSender {
  private correspondents: Map<string, SocketIOConnection> = new Map();

  async makeCorrespondentAvailable(
    connection: SocketIOConnection,
    correspondentUserId: string
  ): Promise<void> {
    this.correspondents.set(correspondentUserId, connection);
  }

  async isCorrespondentAvailable(
    correspondentUserId: string
  ): Promise<boolean> {
    return this.correspondents.has(correspondentUserId);
  }

  async sendMessage(
    message: Message,
    correspondentUserId: string
  ): Promise<void> {
    this.correspondents.get(correspondentUserId).emit('message:send', {
      message: {
        id: message.getId(),
        senderId: message.getSenderId(),
        chatId: message.getChatId(),
        text: message.getText(),
        createdAtISO: message.getCreatedAt().toISOString(),
      },
    });
  }
}
