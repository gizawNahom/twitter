import path from 'path';
import { GraphQLInteraction, Pact } from '@pact-foundation/pact';
import { createPost } from '../lib/redux/slices/postsSlice/createPost';
import { AnyTemplate, like } from '@pact-foundation/pact/src/dsl/matchers';
import { samplePostResponse } from '../mocks/values';
import { setUpClient } from './utilities/helpers';
import { fetchPost } from '../lib/redux/slices/postsSlice/fetchPost';
import { Post } from '../lib/redux/slices/postsSlice/post';
import { fetchPosts } from '../lib/redux/slices/postsSlice/fetchPosts';

const baseUrl = new URL(process.env.NEXT_PUBLIC_API_BASE_URL as string);
const PORT = +baseUrl.port;
const PATH_NAME = baseUrl.pathname;

const ERROR_MESSAGE = 'Server error';

function assertPostEquality(post: Post | null) {
  expect(post).toEqual({
    id: samplePostResponse.id,
    text: samplePostResponse.text,
    userId: samplePostResponse.userId,
    createdAt: new Date(samplePostResponse.createdAt),
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
    const interaction = createInteraction({
      data: {
        createPost: {
          id: like(samplePostResponse.id),
          text: like(samplePostResponse.text),
          userId: like(samplePostResponse.userId),
          createdAt: like(samplePostResponse.createdAt),
          __typename: like(samplePostResponse.__typename),
        },
      },
    })
      .uponReceiving('a request to create a post with a valid text')
      .withVariables({
        text: like(samplePostResponse.text),
      });
    await addInteraction(interaction);

    const [post, errors] = await createPost(samplePostResponse.text);

    expect(errors).toBe(null);
    assertPostEquality(post);
  });

  test('handles error', async () => {
    const invalidText = '';
    const interaction = createInteraction({
      data: {
        createPost: null,
      },
      errors: [
        {
          message: like(ERROR_MESSAGE),
        },
      ],
    })
      .uponReceiving('a request to create a post with an invalid text')
      .withVariables({
        text: like(invalidText),
      });
    await addInteraction(interaction);

    const [post, errors] = await createPost(invalidText);

    expect(errors).not.toBe(null);
    expect(errors?.length).toBe(1);
    expect((errors as string[])[0]).toBe(ERROR_MESSAGE);
    expect(post).toBe(null);
  });

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  function createInteraction(responseBody: any) {
    return createBaseInteraction(responseBody)
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
      );
  }
});

describe('Fetch Post', () => {
  test('fetches post', async () => {
    const interaction = createInteraction({
      data: {
        post: {
          id: like(samplePostResponse.id),
          text: like(samplePostResponse.text),
          userId: like(samplePostResponse.userId),
          createdAt: like(samplePostResponse.createdAt),
          __typename: like(samplePostResponse.__typename),
        },
      },
    })
      .uponReceiving('a request to fetch a post with a valid post id')
      .given('a post with the id exists')
      .withVariables({
        id: like(samplePostResponse.id),
      });
    await addInteraction(interaction);

    const post = await fetchPost(samplePostResponse.id);

    assertPostEquality(post);
  });

  test('handles error', async () => {
    const invalidPostId = '';
    const interaction = createInteraction({
      data: {
        post: null,
      },
      errors: [
        {
          message: like(ERROR_MESSAGE),
        },
      ],
    })
      .uponReceiving('a request to fetch a post with an invalid post id')
      .withVariables({
        id: like(invalidPostId),
      });
    await addInteraction(interaction);

    await expect(async () => {
      await fetchPost(invalidPostId);
    }).rejects.toThrow();
  });

  function createInteraction(responseBody: AnyTemplate) {
    return createBaseInteraction(responseBody)
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
      );
  }
});

describe('Fetches created posts', () => {
  test('paginates created posts', async () => {
    const validOffset = 0;
    const validLimit = 10;
    const interaction = createInteraction({
      data: {
        posts: [
          {
            id: like(samplePostResponse.id),
            text: like(samplePostResponse.text),
            userId: like(samplePostResponse.userId),
            createdAt: like(samplePostResponse.createdAt),
            __typename: like(samplePostResponse.__typename),
          },
        ],
      },
    })
      .uponReceiving(
        'a request to fetch created posts with valid id, offset and limit'
      )
      .withVariables({
        id: like(samplePostResponse.id),
        offset: like(validOffset),
        limit: like(validLimit),
      });
    await addInteraction(interaction);

    const posts = await fetchPosts(
      samplePostResponse.id,
      validOffset,
      validLimit
    );

    expect(posts.length).toBe(1);
    assertPostEquality(posts[0]);
  });

  test('handles error', async () => {
    const invalidId = '';
    const invalidOffset = -1;
    const invalidLimit = -10;
    const interaction = createInteraction({
      data: {
        posts: null,
      },
      errors: [
        {
          message: like(ERROR_MESSAGE),
        },
      ],
    })
      .uponReceiving(
        'a request to fetch created posts with invalid id, offset and limit'
      )
      .withVariables({
        id: like(invalidId),
        offset: like(invalidOffset),
        limit: like(invalidLimit),
      });
    await addInteraction(interaction);

    await expect(async () => {
      await fetchPosts(invalidId, invalidOffset, invalidLimit);
    }).rejects.toThrow(new Error());
  });

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  function createInteraction(responseBody: any) {
    return createBaseInteraction(responseBody)
      .withOperation('Posts')
      .withQuery(
        `
        query Posts($id: ID!, $offset: Int, $limit: Int) {
          posts(id: $id, offset: $offset, limit: $limit) {
            id
            text
            userId
            createdAt
            __typename
          }
        }
      `
      );
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

async function addInteraction(interaction: GraphQLInteraction) {
  await provider.addInteraction(interaction);
}
