import { GetChatsUseCase } from '../../core/useCases/getChatsUseCase';
import { ReadMessagesUseCase } from '../../core/useCases/readMessagesUseCase';
import { ServerContext } from '../app';
import Context from '../context';
import { tryResolve } from '../utilities/tryResolve';

async function getChats(
  _: unknown,
  args: { limit: number; offset: number },
  contextValue: ServerContext
) {
  return await tryResolve(async () => {
    return (
      await new GetChatsUseCase(
        Context.messageGateway,
        Context.gateKeeper,
        Context.logger
      ).execute({
        tokenString: contextValue.token,
        limitValue: args.limit,
        offsetValue: args.offset,
      })
    ).chats;
  });
}

async function readMessages(
  _: unknown,
  args: { limit: number; offset: number; chatId: string },
  contextValue: ServerContext
) {
  return await tryResolve(async () => {
    return (
      await new ReadMessagesUseCase(
        Context.messageGateway,
        Context.gateKeeper,
        Context.logger
      ).execute({
        tokenString: contextValue.token,
        limitValue: args.limit,
        offsetValue: args.offset,
        chatIdString: args.chatId,
      })
    ).messages;
  });
}

export const query = {
  chats: getChats,
  messages: readMessages,
};
