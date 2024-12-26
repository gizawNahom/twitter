import { Chat } from '../domain/chat';
import { GetOrCreateChatGateway } from '../ports/getOrCreateChatGateway';

export class GetOrCreateChatUseCase {
  constructor(private gateway: GetOrCreateChatGateway) {}

  async execute(username: string): Promise<Chat | null> {
    return await this.gateway.getOrCreateChat(username);
  }
}
