import { sendMessage } from '../adapters/api/sendMessage';
import { MessageSender } from '../adapters/gateways/sendMessageGatewayImpl';
import { Message } from '../core/domain/message';

export class ApolloMessageSender implements MessageSender {
  sendMessage(text: string, chatId: string): Promise<Message> {
    return sendMessage(text, chatId);
  }
}
