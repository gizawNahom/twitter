import { CreatePostUseCase } from './core/useCases/createPostUseCase';
import { GetPostUseCase } from './core/useCases/getPostUseCase';
import Context from './context';
import express from 'express';
import { ApolloServer } from '@apollo/server';
import { expressMiddleware } from '@apollo/server/express4';
import cors from 'cors';
import { ValidationError } from './core/errors';
import { GetPostsUseCase } from './core/useCases/getPostsUseCase';

const GENERIC_ERROR_MESSAGE = 'Server Error';

const app = express();

const typeDefs = `#graphql
  type Query {
    hello: String
    post(id: ID!): Post
    posts(userId: ID!, limit: Int, offset: Int): [Post]
  }
  type Mutation {
    createPost(text: String): Post
  }
  type Post {
    id: ID!
    text: String!
    userId: ID!
    createdAt: String!
  }
`;
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
        return await new GetPostUseCase(
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
          await new GetPostsUseCase(
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

interface ServerContext {
  token: string;
}

const server = new ApolloServer<ServerContext>({
  typeDefs,
  resolvers,
});
server.start().then(() => {
  app.use(
    '/graphql',
    cors(),
    express.json(),
    expressMiddleware(server, {
      context: async () => ({ token: 'userToken' }),
    })
  );
});

export { app };
