import { Chat } from '../../core/domain/chat';
import { GetOrCreateChatGateway } from '../../core/ports/getOrCreateChatGateway';

type ChatCreator = (username: string) => Promise<Chat | null>;

export class GetOrCreateChatGatewayImpl implements GetOrCreateChatGateway {
  constructor(private chatCreator: ChatCreator) {}

  getOrCreateChat(username: string): Promise<Chat | null> {
    return this.chatCreator(username);
  }
}
