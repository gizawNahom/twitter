import path from 'path';
import { GraphQLInteraction, Pact } from '@pact-foundation/pact';
import { createPost } from '../../utilities/httpClient';
import { like } from '@pact-foundation/pact/src/dsl/matchers';
import { createPostResponse } from '../../mocks/values';
import { resetClientStore, setCLient } from '../utilities';

const baseUrl = new URL(process.env.NEXT_PUBLIC_API_BASE_URL as string);
const PORT = +baseUrl.port;
const PATH_NAME = baseUrl.pathname;

const provider = new Pact({
  dir: path.resolve(process.cwd(), 'pacts'),
  consumer: 'twitter-client',
  provider: 'twitter-server',
  port: PORT,
});

beforeEach(async () => await provider.setup());

afterEach(async () => await provider.verify());

afterAll(async () => await provider.finalize());

describe('Create Post', () => {
  beforeAll(() => {
    setCLient();
  });

  afterEach(async () => {
    await resetClientStore();
  });
  test('creates post', async () => {
    await addInteractionWithResponseBody({
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
    expect(post).toEqual({
      id: createPostResponse.id,
      text: createPostResponse.text,
      userId: createPostResponse.userId,
      createdAt: new Date(createPostResponse.createdAt),
    });
  });

  test('handles error', async () => {
    const errorMessage = 'Server error';
    await addInteractionWithResponseBody({
      data: null,
      errors: [
        {
          message: errorMessage,
        },
      ],
    });

    const [post, errors] = await createPost(createPostResponse.text);

    expect(errors).not.toBe(null);
    expect(errors?.length).toBe(1);
    expect((errors as string[])[0]).toBe(errorMessage);
    expect(post).toBe(null);
  });

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  async function addInteractionWithResponseBody(responseBody: any) {
    const interaction = new GraphQLInteraction()
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
      })
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
    await provider.addInteraction(interaction);
  }
});
