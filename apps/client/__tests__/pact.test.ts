import path from 'path';
import { GraphQLInteraction, Pact } from '@pact-foundation/pact';
import { createPost } from '../lib/redux/slices/postsSlice/createPost';
import { AnyTemplate, like } from '@pact-foundation/pact/src/dsl/matchers';
import { createPostResponse } from '../mocks/values';
import { setUpClient } from './utilities';
import { fetchPost } from '../lib/redux/slices/postsSlice/fetchPost';
import { Post } from '../lib/redux/slices/postsSlice/post';

const baseUrl = new URL(process.env.NEXT_PUBLIC_API_BASE_URL as string);
const PORT = +baseUrl.port;
const PATH_NAME = baseUrl.pathname;

const ERROR_MESSAGE = 'Server error';

function assertPostEquality(post: Post | null) {
  expect(post).toEqual({
    id: createPostResponse.id,
    text: createPostResponse.text,
    userId: createPostResponse.userId,
    createdAt: new Date(createPostResponse.createdAt),
  });
}

const provider = new Pact({
  dir: path.resolve(process.cwd(), 'pacts'),
  consumer: 'twitter-client',
  provider: 'twitter-server',
  port: PORT,
});

beforeEach(async () => await provider.setup());

afterEach(async () => await provider.verify());

afterAll(async () => await provider.finalize());

setUpClient();

describe('Create Post', () => {
  test('creates post', async () => {
    await addInteractionWithBody({
      data: {
        createPost: {
          id: like(createPostResponse.id),
          text: like(createPostResponse.text),
          userId: like(createPostResponse.userId),
          createdAt: like(createPostResponse.createdAt),
          __typename: like(createPostResponse.__typename),
        },
      },
    });

    const [post, errors] = await createPost(createPostResponse.text);

    expect(errors).toBe(null);
    assertPostEquality(post);
  });

  test('handles error', async () => {
    await addInteractionWithBody({
      data: null,
      errors: [
        {
          message: ERROR_MESSAGE,
        },
      ],
    });

    const [post, errors] = await createPost(createPostResponse.text);

    expect(errors).not.toBe(null);
    expect(errors?.length).toBe(1);
    expect((errors as string[])[0]).toBe(ERROR_MESSAGE);
    expect(post).toBe(null);
  });

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  async function addInteractionWithBody(responseBody: any) {
    const interaction = createBaseInteraction(responseBody)
      .uponReceiving('a request to create a post')
      .withOperation('createPost')
      .withMutation(
        `mutation createPost($text: String) {
            createPost(text: $text) {
              id
              text
              userId
              createdAt
              __typename
            }
          }`
      )
      .withVariables({
        text: like(createPostResponse.text),
      });
    await provider.addInteraction(interaction);
  }
});

describe('Fetch Post', () => {
  test('fetches post', async () => {
    await addInteractionWithBody({
      data: {
        post: {
          id: like(createPostResponse.id),
          text: like(createPostResponse.text),
          userId: like(createPostResponse.userId),
          createdAt: like(createPostResponse.createdAt),
          __typename: like(createPostResponse.__typename),
        },
      },
    });

    const post = await fetchPost(createPostResponse.id);

    assertPostEquality(post);
  });

  test('handles error', async () => {
    await addInteractionWithBody({
      data: null,
      errors: [
        {
          message: ERROR_MESSAGE,
        },
      ],
    });

    await expect(async () => {
      await fetchPost(createPostResponse.id);
    }).rejects.toThrow();
  });

  async function addInteractionWithBody(responseBody: AnyTemplate) {
    const interaction = createBaseInteraction(responseBody)
      .uponReceiving('a request to fetch a post')
      .withOperation('post')
      .withMutation(
        `query post($id: ID!) {
            post(id: $id) {
              id
              text
              userId
              createdAt
              __typename
            }
          }`
      )
      .withVariables({
        id: like(createPostResponse.id),
      });
    await provider.addInteraction(interaction);
  }
});

// eslint-disable-next-line @typescript-eslint/no-explicit-any
function createBaseInteraction(responseBody: any) {
  return new GraphQLInteraction()
    .withRequest({
      path: PATH_NAME,
      method: 'POST',
    })
    .willRespondWith({
      status: 200,
      headers: {
        'Content-Type': 'application/json; charset=utf-8',
      },
      body: responseBody,
    });
}
