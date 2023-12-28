import { app } from '../../src/app';
import Context from '../../src/context';
import { DefaultGateKeeper } from '../../src/defaultGateKeeper';
import { PostRepositoryExceptionStub } from '../doubles/postRepositoryExceptionStub';
import { samplePost, samplePostId } from '../utilities/samples';
import request from 'supertest';
import {
  handlesNonValidationErrorTest,
  passesValidationErrorTest,
} from '../utilities/tests';
import { assertPostResponseMatchesPostEntity } from '../utilities/assertions';

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

beforeEach(() => {
  Context.gateKeeper = new DefaultGateKeeper();
});

test('returns post', async () => {
  await Context.postRepository.save(samplePost);
  const res = await sendRequest();

  expect(res.status).toBe(200);
  assertPostResponseMatchesPostEntity(res.body.data.post, samplePost);
});

passesValidationErrorTest(async () => {
  await Context.postRepository.save(samplePost);
  return await sendRequest();
});

handlesNonValidationErrorTest(async () => {
  Context.postRepository = new PostRepositoryExceptionStub();
  return await sendRequest();
});
