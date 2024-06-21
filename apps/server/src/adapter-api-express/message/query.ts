import { GetChatsUseCase } from '../../core/useCases/getChatsUseCase';
import { ServerContext } from '../app';
import Context from '../context';

async function getChats(
  _: unknown,
  args: { limit: number; offset: number },
  contextValue: ServerContext
) {
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
}

export const query = {
  chats: getChats,
};
