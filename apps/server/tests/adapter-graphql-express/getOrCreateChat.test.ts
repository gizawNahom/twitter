import Context from '../../src/adapter-api-express/context';
import { GetOrCreateChatResponse } from '../../src/core/useCases/getOrCreateChatUseCase';
import { IdGeneratorStub } from '../doubles/idGeneratorStub';
import { MessageGatewaySpy } from '../doubles/messageGatewaySpy';
import { UserRepositorySpy } from '../doubles/userRepositorySpy';
import { removeSeconds, sendRequest } from '../utilities/helpers';
import { sampleUser1, sampleUsername } from '../utilities/samples';

let userRepoSpy: UserRepositorySpy;

async function sendGetOrCreateChatRequest() {
  const query = `mutation GetOrCreateChat($username: String!) {
    chat(username: $username) {
      id
      createdAt
    }
  }`;
  const variables = {
    username: sampleUsername,
  };

  return await sendRequest(query, variables);
}

beforeEach(() => {
  userRepoSpy = new UserRepositorySpy();
  userRepoSpy.getUserResponse = sampleUser1;
  Context.userRepository = userRepoSpy;
  Context.messageGateway = new MessageGatewaySpy();
  Context.idGenerator = new IdGeneratorStub();
});

test('returns correct response', async () => {
  const res = await sendGetOrCreateChatRequest();

  expect(res.status).toBe(200);
  const idGeneratorStub = Context.idGenerator as IdGeneratorStub;
  const expectedResponse = {
    id: idGeneratorStub.STUB_ID,
    createdAt: removeSeconds(new Date().toISOString()),
  };
  assertChat(res.body.data.chat, expectedResponse);

  function assertChat(
    chat: GetOrCreateChatResponse,
    expectedChat: GetOrCreateChatResponse
  ) {
    chat.createdAt = removeSeconds(chat.createdAt);
    expect(chat).toStrictEqual(expectedChat);
  }
});
