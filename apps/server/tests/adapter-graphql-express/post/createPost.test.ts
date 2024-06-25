import Context from '../../../src/adapter-api-express/context';
import { getSavedPosts, sendRequest } from '../../utilities/helpers';
import {
  testWithExpectedError,
  testWithUnExpectedError,
} from '../../utilities/tests';
import { DefaultGateKeeper } from '../../../src/adapter-api-express/defaultGateKeeper';
import { assertPostResponseMatchesPostEntity } from '../../utilities/assertions';

const validText = 'Hello, world!';

async function sendCreatePostRequestWithText(text: string) {
  const query = `mutation($text: String!) {
    createPost(text: $text) {
      id
      text
      userId
      createdAt
    }
  }`;
  const variables = { text };

  return await sendRequest(query, variables);
}

beforeEach(() => {
  Context.gateKeeper = new DefaultGateKeeper();
});

test('returns created post', async () => {
  const res = await sendCreatePostRequestWithText(validText);

  expect(res.status).toBe(200);
  const savedPost = (await getSavedPosts())[0];
  assertPostResponseMatchesPostEntity(res.body.data.createPost, savedPost);
});

testWithExpectedError(
  async () => await sendCreatePostRequestWithText(validText)
);

testWithUnExpectedError(
  async () => await sendCreatePostRequestWithText(validText)
);
