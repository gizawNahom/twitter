import { SendMessageUseCase } from '../../core/useCases/sendMessageUseCase';
import { GetOrCreateChatUseCase } from '../../core/useCases/getOrCreateChatUseCase';
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

async function resolveChat(
  _: unknown,
  args: { username: string },
  contextValue: ServerContext
) {
  return await tryResolve(async () => {
    return await new GetOrCreateChatUseCase(
      Context.idGenerator,
      Context.messageGateway,
      Context.userRepository,
      Context.gateKeeper,
      Context.logger
    ).execute({
      tokenString: contextValue.token,
      usernameString: args.username,
    });
  });
}

export const mutation = {
  sendMessage: sendMessage,
  chat: resolveChat,
};
