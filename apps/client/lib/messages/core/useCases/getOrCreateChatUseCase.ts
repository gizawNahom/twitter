import { PartialChat } from '../domain/partialChat';
import { GetOrCreateChatGateway } from '../ports/getOrCreateChatGateway';

export class GetOrCreateChatUseCase {
  constructor(private gateway: GetOrCreateChatGateway) {}

  async execute(username: string): Promise<PartialChat | null> {
    return await this.gateway.getOrCreateChat(username);
  }
}
