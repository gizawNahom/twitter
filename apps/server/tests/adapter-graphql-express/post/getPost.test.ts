import Context from '../../../src/adapter-api-express/context';
import { DefaultGateKeeper } from '../../../src/adapter-api-express/defaultGateKeeper';
import { samplePost, samplePostId } from '../../utilities/samples';
import {
  testWithExpectedError,
  testWithUnExpectedError,
} from '../../utilities/tests';
import { assertPostResponseMatchesPostEntity } from '../../utilities/assertions';
import { sendRequest } from '../../utilities/helpers';

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

testWithExpectedError(async () => {
  await Context.postRepository.save(samplePost);
  return await sendGetPostRequest();
});

testWithUnExpectedError(async () => await sendGetPostRequest());
