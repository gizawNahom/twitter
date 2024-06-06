import { CreatePostUseCase } from '../core/useCases/createPostUseCase';
import { GetUserPostUseCase } from '../core/useCases/getUserPostUseCase';
import Context from './context';
import { GetUserPostsUseCase } from '../core/useCases/getUserPostsUseCase';
import { SearchPostsUseCase } from '../core/useCases/searchPostsUseCase';
import { ValidationError } from '../core/errors';
import { ServerContext } from './app';

const GENERIC_ERROR_MESSAGE = 'Server Error';

const resolvers = {
  Mutation: {
    createPost: async (
      _: unknown,
      args: { text: string },
      contextValue: ServerContext
    ) => {
      return await tryResolve(async () => {
        return await new CreatePostUseCase(
          Context.logger,
          Context.gateKeeper,
          Context.postRepository
        ).execute(contextValue.token, args.text);
      });
    },
  },
  Query: {
    post: async (
      _: unknown,
      { id }: { id: string },
      contextValue: ServerContext
    ) => {
      return await tryResolve(async () => {
        return await new GetUserPostUseCase(
          Context.logger,
          Context.gateKeeper,
          Context.postRepository
        ).execute(contextValue.token, id);
      });
    },
    posts: async (
      _: unknown,
      {
        userId,
        limit,
        offset,
      }: { userId: string; limit: number; offset: number },
      contextValue: ServerContext
    ) => {
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
    },
    searchPosts: async (
      _: unknown,
      {
        query,
        limit,
        offset,
      }: { query: string; limit: number; offset: number },
      contextValue: ServerContext
    ) => {
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
    },
  },
};

async function tryResolve(resolve: () => Promise<unknown>) {
  try {
    return await resolve();
  } catch (error) {
    Context.logger.logError(error);
    if (isValidationError(error)) throw error;
    throwGenericError();
  }

  function isValidationError(error: Error) {
    return error instanceof ValidationError;
  }

  function throwGenericError() {
    throw new Error(GENERIC_ERROR_MESSAGE);
  }
}

export default resolvers;
