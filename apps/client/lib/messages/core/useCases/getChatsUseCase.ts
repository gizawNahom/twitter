import { Chat } from '../domain/chat';
import { GetChatsGateway } from '../ports/getChatsGateway';

export class GetChatsUseCase {
  constructor(private gateway: GetChatsGateway) {}

  async execute(offset: number, limit: number): Promise<Chat[]> {
    return await this.gateway.getChats(offset, limit);
  }
}
