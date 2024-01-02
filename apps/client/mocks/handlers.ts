import { graphql } from 'msw';
import { samplePostResponse } from './values';

export let wasCreatePostCalled = false;
export let wasPostCalled = false;

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
];

export const errorHandler = graphql.operation((req, res, ctx) => {
  return res(ctx.errors([{ message: 'Generic error' }]));
});
