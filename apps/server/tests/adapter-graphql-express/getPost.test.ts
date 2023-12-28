import Context from '../../src/context';
import { DefaultGateKeeper } from '../../src/defaultGateKeeper';
import { PostRepositoryExceptionStub } from '../doubles/postRepositoryExceptionStub';
import { samplePost, samplePostId } from '../utilities/samples';
import {
  handlesNonValidationErrorTest,
  passesValidationErrorTest,
} from '../utilities/tests';
import { assertPostResponseMatchesPostEntity } from '../utilities/assertions';
import { sendRequest } from '../utilities/helpers';

async function sendGetPostRequest(id = samplePostId) {
  const query = `query($id: ID!) {
    post(id: $id) {
      id
      text
      userId
      createdAt
    }
  }`;
  const variables = { id };
  return await sendRequest(query, variables);
}

beforeEach(() => {
  Context.gateKeeper = new DefaultGateKeeper();
});

test('returns post', async () => {
  await Context.postRepository.save(samplePost);
  const res = await sendGetPostRequest();

  expect(res.status).toBe(200);
  assertPostResponseMatchesPostEntity(res.body.data.post, samplePost);
});

passesValidationErrorTest(async () => {
  await Context.postRepository.save(samplePost);
  return await sendGetPostRequest();
});

handlesNonValidationErrorTest(async () => {
  Context.postRepository = new PostRepositoryExceptionStub();
  return await sendGetPostRequest();
});
