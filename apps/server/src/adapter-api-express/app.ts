import express from 'express';
import { ApolloServer } from '@apollo/server';
import { expressMiddleware } from '@apollo/server/express4';
import cors from 'cors';
import resolvers from './resolvers';
import postTypeDefs from './post/typeDefs';
import messageTypeDefs from './message/typeDefs';

const app = express();

export interface ServerContext {
  token: string;
}

const server = new ApolloServer<ServerContext>({
  typeDefs: [postTypeDefs, messageTypeDefs],
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
