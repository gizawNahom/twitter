import Context from '../../src/context';
import { getSavedPosts, sendRequest } from '../utilities/helpers';
import {
  handlesExpectedErrorTest,
  handlesUnexpectedErrorTest,
} from '../utilities/tests';
import { DefaultGateKeeper } from '../../src/defaultGateKeeper';
import { assertPostResponseMatchesPostEntity } from '../utilities/assertions';

const validText = 'Hello, world!';

async function sendCreatePostRequestWithText(text: string) {
  const query = `mutation($text: String) {
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

handlesExpectedErrorTest(
  async () => await sendCreatePostRequestWithText(validText)
);

handlesUnexpectedErrorTest(
  async () => await sendCreatePostRequestWithText(validText)
);
