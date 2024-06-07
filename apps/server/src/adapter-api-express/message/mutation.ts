import { SendMessageUseCase } from '../../core/useCases/sendMessageUseCase';
import { ServerContext } from '../app';
import Context from '../context';
import { tryResolve } from '../resolvers';

async function sendMessage(
  _: unknown,
  args: { text: string; chatId: string },
  contextValue: ServerContext
) {
  return await tryResolve(async () => {
    const response = await new SendMessageUseCase(
      Context.gateKeeper,
      Context.messageGateway,
      Context.idGenerator,
      Context.messageSender,
      Context.logger
    ).execute({
      token: contextValue.token,
      text: args.text,
      chatId: args.chatId,
    });
    return { ...response.message, createdAt: response.message.createdAtISO };
  });
}

export const mutation = {
  sendMessage: sendMessage,
};
