import { app } from '../src/app';
import request from 'supertest';
import Context from '../src/context';
import { PostRepositoryExceptionStub } from './doubles/postRepositoryExceptionStub';
import { getSavedPosts, removeSeconds } from './utilities/helpers';
import { ERROR_EMPTY_TEXT } from './utilities/errorMessages';

const validText = 'Hello, world!';

async function sendRequestWithText(text: string) {
  const query = `mutation($text: String) {
    createPost(text: $text) {
      id
      text
      userId
      createdAt
    }
  }`;
  const variables = { text };

  return await request(app).post('/graphql').send({
    query,
    variables,
  });
}

test('returns created post', async () => {
  const res = await sendRequestWithText(validText);

  expect(res.status).toBe(200);
  const savedPost = (await getSavedPosts())[0];
  const post = res.body.data.createPost;
  post.createdAt = removeSeconds(post.createdAt);
  expect(post).toStrictEqual({
    id: 'postId1',
    text: savedPost.getText(),
    createdAt: removeSeconds(savedPost.getCreatedAt().toISOString()),
    userId: savedPost.getUserId(),
  });
});

test('passes errors', async () => {
  const res = await sendRequestWithText('');

  expect(res.body.errors.length).toBe(1);
  expect(res.body.errors[0].message).toBe(ERROR_EMPTY_TEXT);
});

test('handles none validation errors', async () => {
  Context.postRepository = new PostRepositoryExceptionStub();

  const res = await sendRequestWithText(validText);

  expect(res.body.errors.length).toBe(1);
  expect(res.body.errors[0].message).toBe('Server Error');
});
