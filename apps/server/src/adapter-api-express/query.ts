import { GetUserPostUseCase } from '../core/useCases/getUserPostUseCase';
import Context from './context';
import { GetUserPostsUseCase } from '../core/useCases/getUserPostsUseCase';
import { SearchPostsUseCase } from '../core/useCases/searchPostsUseCase';
import { ServerContext } from './app';
import { tryResolve } from './resolvers';

async function resolvePost(
  _: unknown,
  { id }: { id: string },
  contextValue: ServerContext
) {
  return await tryResolve(async () => {
    return await new GetUserPostUseCase(
      Context.logger,
      Context.gateKeeper,
      Context.postRepository
    ).execute(contextValue.token, id);
  });
}

async function resolvePosts(
  _: unknown,
  { userId, limit, offset }: { userId: string; limit: number; offset: number },
  contextValue: ServerContext
) {
  return tryResolve(async () => {
    const posts = (
      await new GetUserPostsUseCase(
        Context.gateKeeper,
        Context.userRepository,
        Context.postRepository,
        Context.logger
      ).execute({ token: contextValue.token, userId, limit, offset })
    ).posts;
    return posts.map((p) => {
      return {
        id: p.getId(),
        text: p.getText(),
        userId: p.getUserId(),
        createdAt: p.getCreatedAt().toISOString(),
      };
    });
  });
}

async function resolveSearchPosts(
  _: unknown,
  { query, limit, offset }: { query: string; limit: number; offset: number },
  contextValue: ServerContext
) {
  return tryResolve(async () => {
    const posts = (
      await new SearchPostsUseCase(
        Context.gateKeeper,
        Context.postIndexGateway,
        Context.logger
      ).execute({ token: contextValue.token, query, limit, offset })
    ).posts;
    return posts.map((p) => {
      return {
        id: p.getId(),
        text: p.getText(),
        userId: p.getUserId(),
        createdAt: p.getCreatedAt().toISOString(),
      };
    });
  });
}

export const query = {
  post: resolvePost,
  posts: resolvePosts,
  searchPosts: resolveSearchPosts,
};
