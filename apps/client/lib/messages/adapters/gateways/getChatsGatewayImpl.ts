import { Chat } from '../../core/domain/chat';
import { GetChatsGateway } from '../../core/ports/getChatsGateway';

export class GetChatsGatewayImpl implements GetChatsGateway {
  constructor(private chatsGetter: ChatsGetter) {}

  async getChats(): Promise<Chat[] | undefined> {
    return this.chatsGetter.getChats();
  }
}

export interface ChatsGetter {
  getChats(): Promise<Chat[] | undefined>;
}
