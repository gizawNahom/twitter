import { Chat } from '../../core/domain/chat';
import { GetChatsGateway } from '../../core/ports/getChatsGateway';

type ChatsGetter = (offset: number, limit: number) => Promise<Chat[]>;

export class GetChatsGatewayImpl implements GetChatsGateway {
  constructor(private chatsGetter: ChatsGetter) {}

  getChats(offset: number, limit: number): Promise<Chat[]> {
    return this.chatsGetter(offset, limit);
  }
}
