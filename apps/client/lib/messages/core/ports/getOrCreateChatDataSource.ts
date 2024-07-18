import { PartialChat } from '../domain/partialChat';

export interface GetOrCreateChatDataSource {
  getOrCreateChat: (username: string) => Promise<PartialChat | null>;
}
