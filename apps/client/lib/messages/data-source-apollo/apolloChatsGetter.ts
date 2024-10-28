import { getChats } from '../adapters/api/getChats';
import { ChatsGetter } from '../adapters/gateways/getChatsGatewayImpl';
import { Chat } from '../core/domain/chat';

export class ApolloChatsGetter implements ChatsGetter {
  async getChats(offset: number): Promise<Chat[] | undefined> {
    return await getChats(offset, 3);
  }
}
