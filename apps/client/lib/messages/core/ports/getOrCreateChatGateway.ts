import { PartialChat } from '../domain/partialChat';

export interface GetOrCreateChatGateway {
  getOrCreateChat(username: string): Promise<PartialChat | null>;
}
