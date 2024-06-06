import { CreatePostUseCase } from '../core/useCases/createPostUseCase';
import Context from './context';
import { ServerContext } from './app';
import { tryResolve } from './resolvers';

async function resolveCreatePost(
  _: unknown,
  args: { text: string },
  contextValue: ServerContext
) {
  return await tryResolve(async () => {
    return await new CreatePostUseCase(
      Context.logger,
      Context.gateKeeper,
      Context.postRepository
    ).execute(contextValue.token, args.text);
  });
}

export const mutation = {
  createPost: resolveCreatePost,
};
