import { GraphQLVariables, graphql } from 'msw';
import { GENERIC_SERVER_ERROR, samplePostResponse } from './values';
import { Operations } from '../__tests__/testUtilities/operations';

export let wasCreatePostCalled = false;
export let wasPostCalled = false;
export let wasPostsCalled = false;
export let postsVariables: GraphQLVariables;

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
];

export const postsErrorHandler = graphql.query(
  Operations.Posts,
  (req, res, ctx) => {
    wasPostsCalled = true;
    return res(ctx.errors([{ message: GENERIC_SERVER_ERROR }]));
  }
);

export const genericErrorHandler = graphql.operation((req, res, ctx) => {
  return res(ctx.errors([{ message: GENERIC_SERVER_ERROR }]));
});
