import { graphql } from 'msw';
import { GENERIC_SERVER_ERROR, samplePostResponse } from './values';

export let wasCreatePostCalled = false;
export let wasPostCalled = false;
export let wasPostsCalled = false;

export const handlers = [
  graphql.mutation('createPost', (req, res, ctx) => {
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
  graphql.query('post', (req, res, ctx) => {
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
  graphql.query('Posts', (req, res, ctx) => {
    wasPostsCalled = true;
    return res(
      ctx.data({
        posts: [],
      })
    );
  }),
];

export const postsErrorHandler = graphql.query('Posts', (req, res, ctx) => {
  wasPostsCalled = true;
  return res(ctx.errors([{ message: GENERIC_SERVER_ERROR }]));
});

export const errorHandler = graphql.operation((req, res, ctx) => {
  return res(ctx.errors([{ message: GENERIC_SERVER_ERROR }]));
});
