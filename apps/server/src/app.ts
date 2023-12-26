import { createPostUseCase } from './core/createPostUseCase';
import Context from './context';
import express from 'express';
import { ApolloServer } from '@apollo/server';
import { expressMiddleware } from '@apollo/server/express4';
import cors from 'cors';
import { ValidationError } from './core/errors';

const app = express();

const typeDefs = `#graphql
  type Query {
    hello: String
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
      try {
        return await tryCreatePost();
      } catch (error) {
        if (isValidationError(error)) throw error;
        throwGenericError();
      }

      async function tryCreatePost() {
        return await new createPostUseCase(
          Context.gateKeeper,
          Context.postRepository
        ).execute(contextValue.token, args.text);
      }

      function isValidationError(error: Error) {
        return error instanceof ValidationError;
      }

      function throwGenericError() {
        throw new Error('Server Error');
      }
    },
  },
};

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
