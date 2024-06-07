import Context from '../../src/adapter-api-express/context';
import { DefaultGateKeeper } from '../../src/adapter-api-express/defaultGateKeeper';
import { MessageGatewaySpy } from '../doubles/messageGatewaySpy';
import { IdGeneratorStub } from '../doubles/idGeneratorStub';
import { MessageSenderSpy } from '../doubles/messageSenderSpy';
import { removeSeconds, sendRequest } from '../utilities/helpers';
import { sampleChatId, sampleMessage } from '../utilities/samples';

// SEND TOKEN WITH REQUEST

let messageGatewaySpy: MessageGatewaySpy;

async function sendMessageRequest(text: string, chatId: string) {
  const query = `mutation($text: String!, $chatId: String!) {
    sendMessage(text: $text, chatId: $chatId) {
      id
      senderId
      chatId
      text
      createdAt
    }
  }`;
  const variables = { text, chatId };

  return await sendRequest(query, variables);
}

beforeEach(() => {
  Context.gateKeeper = new DefaultGateKeeper();
  messageGatewaySpy = new MessageGatewaySpy();
  Context.messageGateway = messageGatewaySpy;
  Context.idGenerator = new IdGeneratorStub();
  Context.messageSender = new MessageSenderSpy();
});

test('returns correct response', async () => {
  messageGatewaySpy.doesChatExistResponse = true;

  const res = await sendMessageRequest(sampleMessage, sampleChatId);

  expect(res.status).toBe(200);
  assertCorrectResponse(res.body.data.sendMessage);

  function assertCorrectResponse(response) {
    const savedMessage = messageGatewaySpy.savedMessage;
    response.createdAt = removeSeconds(response.createdAt);
    expect(response).toStrictEqual({
      id: savedMessage.getId(),
      senderId: savedMessage.getSenderId(),
      chatId: savedMessage.getChatId(),
      text: savedMessage.getText(),
      createdAt: removeSeconds(savedMessage.getCreatedAt().toISOString()),
    });
  }
});
