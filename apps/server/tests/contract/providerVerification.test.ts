import { Verifier } from '@pact-foundation/pact';
import path from 'path';
import Context from '../../src/adapter-api-express/context';
import { InMemoryPostRepository } from '../../src/adapter-persistance-inMemory/InMemoryPostRepository';
import { Post } from '../../src/core/entities/post';
import { PostIndexGatewaySpy } from '../doubles/postIndexGatewaySpy';
import { createServer } from '../../src/adapter-api-express/server';
import { UserRepositorySpy } from '../doubles/userRepositorySpy';
import { sampleUser1, sampleUser2 } from '../utilities/samples';
import { IdGeneratorStub } from '../doubles/idGeneratorStub';
import { MessageGatewaySpy } from '../doubles/messageGatewaySpy';

const port = 8081;
const baseUrl = `http://localhost:${port}`;

const server = createServer().listen(port, () => {
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
        'a user with the username exists': async () => {
          const userRepoSpy = Context.userRepository as UserRepositorySpy;
          userRepoSpy.getUsersResponse = [sampleUser1];
          userRepoSpy.getUserResponse = sampleUser2;
        },
      },
      beforeEach: async () => {
        Context.postRepository = new InMemoryPostRepository();
        Context.postIndexGateway = new PostIndexGatewaySpy();
        Context.userRepository = new UserRepositorySpy();
        Context.idGenerator = new IdGeneratorStub();
        Context.messageGateway = new MessageGatewaySpy();
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
