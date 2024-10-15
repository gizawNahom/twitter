import { Message } from '../domain/message';
import { SendMessageGateway } from '../ports/sendMessageGateway';

interface SendMessageRequest {
  senderId: string;
  text: string;
  chatId: string;
}

export class SendMessageUseCase {
  constructor(private gateway: SendMessageGateway) {}

  async execute({
    senderId,
    text,
    chatId,
  }: SendMessageRequest): Promise<Message | null> {
    return await this.gateway.sendMessage(text, chatId);
  }
}
