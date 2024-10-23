import { GraphQLVariables, graphql } from 'msw';
import {
  GENERIC_SERVER_ERROR,
  samplePartialChatResponse,
  samplePostResponse,
  sampleUserResponse,
  searchPostsResponse,
} from './values';
import { Operations } from '../__tests__/testUtilities/operations';
import chatsDB from '../test/data/chats';
import messagesDB from '../test/data/messages';
import { Context } from '../lib/auth/context';

export let wasCreatePostCalled = false;
export let wasPostCalled = false;
export let wasPostsCalled = false;
export let postsVariables: GraphQLVariables;
export const searchPostsCalls: GraphQLVariables[] = [];
export const getUsersCalls: GraphQLVariables[] = [];
export const sendMessageCalls: GraphQLVariables[] = [];
export const getOrCreateChatCalls: GraphQLVariables[] = [];
export const genericErrorHandlerCalls: GraphQLVariables[] = [];

export const handlers = [
  graphql.mutation(Operations.CreatePost, (req, res, ctx) => {
    wasCreatePostCalled = true;
    return res(
      ctx.delay(),
      ctx.data({
        createPost: {
          id: samplePostResponse.id,
          text: samplePostResponse.text,
          userId: samplePostResponse.userId,
          createdAt: samplePostResponse.createdAt,
          __typename: samplePostResponse.__typename,
        },
      })
    );
  }),
  graphql.query(Operations.Post, (req, res, ctx) => {
    wasPostCalled = true;
    return res(
      ctx.delay(),
      ctx.data({
        post: {
          id: samplePostResponse.id,
          text: samplePostResponse.text,
          userId: samplePostResponse.userId,
          createdAt: samplePostResponse.createdAt,
          __typename: samplePostResponse.__typename,
        },
      })
    );
  }),
  graphql.query(Operations.Posts, ({ variables }, res, ctx) => {
    wasPostsCalled = true;
    postsVariables = variables;
    return res(
      ctx.data({
        posts: [
          {
            id: samplePostResponse.id,
            text: samplePostResponse.text,
            userId: samplePostResponse.userId,
            createdAt: samplePostResponse.createdAt,
            __typename: samplePostResponse.__typename,
          },
        ],
      })
    );
  }),
  graphql.query(Operations.SearchPosts, ({ variables }, res, ctx) => {
    searchPostsCalls.push(variables);
    return res(
      ctx.delay(1),
      ctx.data({
        searchPosts: searchPostsResponse,
      })
    );
  }),
  graphql.query(Operations.GetUsers, ({ variables }, res, ctx) => {
    getUsersCalls.push(variables);
    return res(
      ctx.delay(1),
      ctx.data({
        users: [sampleUserResponse],
      })
    );
  }),
  graphql.mutation(Operations.SendMessage, async ({ variables }, res, ctx) => {
    sendMessageCalls.push(variables);
    const senderId = Context.getLoggedInUserUseCase.execute().id;

    return res(
      ctx.delay(450),
      ctx.data({
        sendMessage: await messagesDB.create(
          variables.chatId as string,
          variables.text as string,
          senderId
        ),
      })
    );
  }),
  graphql.mutation(Operations.GetOrCreateChat, ({ variables }, res, ctx) => {
    getOrCreateChatCalls.push(variables);
    return res(
      ctx.delay(1),
      ctx.data({
        chat: samplePartialChatResponse,
      })
    );
  }),
  graphql.query(Operations.GetChats, async ({ variables }, res, ctx) => {
    return res(
      ctx.delay(1),
      ctx.data({
        chats: await chatsDB.read(variables.offset, variables.limit),
      })
    );
  }),
  graphql.query(Operations.ReadMessages, async ({ variables }, res, ctx) => {
    return res(
      ctx.delay(1),
      ctx.data({
        messages: await messagesDB.read1(
          variables.offset,
          variables.limit,
          variables.chatId
        ),
      })
    );
  }),
];

export const postsErrorHandler = graphql.query(
  Operations.Posts,
  (req, res, ctx) => {
    wasPostsCalled = true;
    return res(ctx.errors([{ message: GENERIC_SERVER_ERROR }]));
  }
);

export const genericErrorHandler = graphql.operation(
  ({ variables }, res, ctx) => {
    genericErrorHandlerCalls.push(variables);
    return res(ctx.delay(1), ctx.errors([{ message: GENERIC_SERVER_ERROR }]));
  }
);
