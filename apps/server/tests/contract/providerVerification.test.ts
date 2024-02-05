import { Verifier } from '@pact-foundation/pact';
import { app } from '../../src/app';
import path from 'path';
import Context from '../../src/context';
import { InMemoryPostRepository } from '../../src/adapter-persistance-inMemory/InMemoryPostRepository';
import { Post } from '../../src/core/entities/post';

const port = 8081;
const baseUrl = `http://localhost:${port}`;

const server = app.listen(port, () => {
  console.log(`Service listening on ${baseUrl}`);
});

async function savePost() {
  const post = new Post();
  post.setText('Hello World');
  post.setUserId('userId1');
  await Context.postRepository.save(post);
}

describe('Pact verification', () => {
  test('validate the expectations of the matching consumer', () => {
    return new Verifier({
      providerBaseUrl: baseUrl,
      pactUrls: [
        path.resolve(
          process.cwd(),
          './pacts/twitter-client-twitter-server.json'
        ),
      ],
      stateHandlers: {
        'a post with the id exists': async () => {
          await savePost();
        },
        'a user has created a post': async () => {
          await savePost();
        },
      },
      beforeEach: async () => {
        Context.postRepository = new InMemoryPostRepository();
      },
    })
      .verifyProvider()
      .then(() => {
        console.log('Pact Verification Complete!');
      });
  }, 10000);

  afterAll(() => {
    server.close();
  });
});
