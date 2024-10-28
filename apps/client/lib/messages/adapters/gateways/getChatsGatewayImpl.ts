import { Chat } from '../../core/domain/chat';
import { GetChatsGateway } from '../../core/ports/getChatsGateway';

export class GetChatsGatewayImpl implements GetChatsGateway {
  constructor(private chatsGetter: ChatsGetter) {}

  async getChats(offset: number): Promise<Chat[] | undefined> {
    return this.chatsGetter.getChats(offset);
  }
}

export interface ChatsGetter {
  getChats(offset: number): Promise<Chat[] | undefined>;
}
