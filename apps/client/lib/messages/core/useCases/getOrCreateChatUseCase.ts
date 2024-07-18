import { PartialChat } from '../domain/partialChat';
import { GetOrCreateChatDataSource } from '../ports/getOrCreateChatDataSource';

export class GetOrCreateChatUseCase {
  constructor(private dataSource: GetOrCreateChatDataSource) {}

  async execute(username: string): Promise<PartialChat | null> {
    return await this.dataSource.getOrCreateChat(username);
  }
}
