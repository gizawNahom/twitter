import { PartialChat } from '../../core/domain/partialChat';
import { GetOrCreateChatGateway } from '../../core/ports/getOrCreateChatGateway';

type ChatCreator = (username: string) => Promise<PartialChat | null>;

export class GetOrCreateChatGatewayImpl implements GetOrCreateChatGateway {
  constructor(private chatCreator: ChatCreator) {}

  getOrCreateChat(username: string): Promise<PartialChat | null> {
    return this.chatCreator(username);
  }
}
