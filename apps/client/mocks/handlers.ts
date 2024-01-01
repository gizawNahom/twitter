import { graphql } from 'msw';
import { createPostResponse } from './values';

export let wasCreatePostCalled = false;
export let wasPostCalled = false;

export const handlers = [
  graphql.mutation('createPost', (req, res, ctx) => {
    wasCreatePostCalled = true;
    return res(
      ctx.delay(),
      ctx.data({
        createPost: {
          id: createPostResponse.id,
          text: createPostResponse.text,
          userId: createPostResponse.userId,
          createdAt: createPostResponse.createdAt,
          __typename: createPostResponse.__typename,
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
          id: createPostResponse.id,
          text: createPostResponse.text,
          userId: createPostResponse.userId,
          createdAt: createPostResponse.createdAt,
          __typename: createPostResponse.__typename,
        },
      })
    );
  }),
];

export const errorHandler = graphql.operation((req, res, ctx) => {
  return res(ctx.errors([{ message: 'Generic error' }]));
});
