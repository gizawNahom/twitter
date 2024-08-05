import { getChats } from "../adapters/api/getChats";
import { ChatsGetter } from "../adapters/gateways/getChatsGatewayImpl";
import { Chat } from "../core/domain/chat";

export class ApChatsGetter implements ChatsGetter {
  constructor(private offset: number) {}

  async getChats(): Promise<Chat[] | undefined> {
    return await getChats(this.offset, 3);
  }
}
