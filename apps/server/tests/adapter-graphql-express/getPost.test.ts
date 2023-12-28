import { app } from '../../src/app';
import Context from '../../src/context';
import { PostRepositoryExceptionStub } from '../doubles/postRepositoryExceptionStub';
import { ERROR_POST_ID_Required } from '../utilities/errorMessages';
import { removeSeconds } from '../utilities/helpers';
import { samplePost, samplePostId } from '../utilities/samples';
import request from 'supertest';

async function sendRequest(id = samplePostId) {
  const query = `query($id: ID!) {
    post(id: $id) {
      id
      text
      userId
      createdAt
    }
  }`;
  const variables = { id };
  const res = await request(app).post('/graphql').send({
    query,
    variables,
  });
  return res;
}

test('returns post', async () => {
  await Context.postRepository.save(samplePost);
  const res = await sendRequest();

  expect(res.status).toBe(200);
  const post = res.body.data.post;
  post.createdAt = removeSeconds(post.createdAt);
  expect(post).toStrictEqual({
    id: samplePost.getId(),
    text: samplePost.getText(),
    createdAt: removeSeconds(samplePost.getCreatedAt().toISOString()),
    userId: samplePost.getUserId(),
  });
});

test('passes validation errors', async () => {
  await Context.postRepository.save(samplePost);
  const res = await sendRequest('');

  expect(res.body.errors.length).toBe(1);
  expect(res.body.errors[0].message).toBe(ERROR_POST_ID_Required);
});

test('handles non-validation errors', async () => {
  Context.postRepository = new PostRepositoryExceptionStub();
  const res = await sendRequest();

  expect(res.body.errors.length).toBe(1);
  expect(res.body.errors[0].message).toBe('Server Error');
});
