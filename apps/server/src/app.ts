import { CreatePostUseCase } from './core/useCases/createPostUseCase';
import { GetPostUseCase } from './core/useCases/getPostUseCase';
import Context from './context';
import express from 'express';
import { ApolloServer } from '@apollo/server';
import { expressMiddleware } from '@apollo/server/express4';
import cors from 'cors';
import { ValidationError } from './core/errors';

const GENERIC_ERROR_MESSAGE = 'Server Error';

const app = express();

const typeDefs = `#graphql
  type Query {
    hello: String
    post(id: ID!): Post
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
