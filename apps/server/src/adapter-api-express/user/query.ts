import { GetUsersUseCase } from '../../core/useCases/getUsersUseCase';
import { ServerContext } from '../app';
import Context from '../context';
import { tryResolve } from '../utilities/tryResolve';

async function resolveUsers(
  _: unknown,
  args: { username: string; limit: number; offset: number },
  contextValue: ServerContext
) {
  return await tryResolve(async () => {
    return (
      await new GetUsersUseCase(
        Context.userRepository,
        Context.gateKeeper,
        Context.logger
      ).execute({
        tokenString: contextValue.token,
        limitValue: args.limit,
        offsetValue: args.offset,
        usernameString: args.username,
      })
    ).users;
  });
}

export const query = {
  users: resolveUsers,
};
