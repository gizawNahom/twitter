import { SendMessageUseCase } from '../../core/useCases/sendMessageUseCase';
import { ServerContext } from '../app';
import Context from '../context';
import { tryResolve } from '../utilities/tryResolve';

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
      tokenString: contextValue.token,
      textString: args.text,
      chatIdString: args.chatId,
    });
    return response.message;
  });
}

export const mutation = {
  sendMessage: sendMessage,
};
