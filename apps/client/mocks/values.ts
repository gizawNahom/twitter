export const samplePostResponse = {
  id: 'postId1',
  text: 'Hello World',
  userId: 'userId1',
  createdAt: '2023-12-09T04:47:07Z',
  __typename: 'Post',
};

export const sampleOffset = 0;
export const sampleLimit = 10;

export const sampleInvalidOffset = -1;
export const sampleInvalidLimit = -10;

export const searchPostsResponse = [samplePostResponse];

export const GENERIC_SERVER_ERROR = 'Generic error';
