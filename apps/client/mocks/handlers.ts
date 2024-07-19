import { GraphQLVariables, graphql } from 'msw';
import {
  GENERIC_SERVER_ERROR,
  sampleMessageResponse,
  samplePartialChatResponse,
  samplePostResponse,
  sampleUserResponse,
  searchPostsResponse,
} from './values';
import { Operations } from '../__tests__/testUtilities/operations';

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
  graphql.mutation(Operations.SendMessage, ({ variables }, res, ctx) => {
    sendMessageCalls.push(variables);
    return res(
      ctx.delay(450),
      ctx.data({
        sendMessage: sampleMessageResponse,
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
