import { app } from '../../src/app';
import request from 'supertest';
import Context from '../../src/context';
import { PostRepositoryExceptionStub } from '../doubles/postRepositoryExceptionStub';
import { getSavedPosts } from '../utilities/helpers';
import {
  handlesNonValidationErrorTest,
  passesValidationErrorTest,
} from '../utilities/tests';
import { DefaultGateKeeper } from '../../src/defaultGateKeeper';
import { assertPostResponseMatchesPostEntity } from '../utilities/assertions';

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

beforeEach(() => {
  Context.gateKeeper = new DefaultGateKeeper();
});

test('returns created post', async () => {
  const res = await sendRequestWithText(validText);

  expect(res.status).toBe(200);
  const savedPost = (await getSavedPosts())[0];
  assertPostResponseMatchesPostEntity(res.body.data.createPost, savedPost);
});

passesValidationErrorTest(async () => await sendRequestWithText(validText));

handlesNonValidationErrorTest(async () => {
  Context.postRepository = new PostRepositoryExceptionStub();
  return await sendRequestWithText(validText);
});
