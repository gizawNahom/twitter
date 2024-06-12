import { GetOnlineUseCase } from '../../src/core/useCases/getOnlineUseCase';
import { sampleUserToken } from '../utilities/samples';
import Context from '../../src/adapter-api-express/context';
import {
  testUserExtractionFailure,
  testWithInvalidToken,
} from '../utilities/tests';
import { DefaultGateKeeper } from '../../src/adapter-api-express/defaultGateKeeper';
import { LoggerSpy } from '../doubles/loggerSpy';
import { MessageSenderSpy } from '../doubles/messageSenderSpy';
import { Connection } from '../../src/core/entities/connection';

class DummyConnection extends Connection {}

let messageSenderSpy: MessageSenderSpy;
const dummyConnection = new DummyConnection();

function executeUseCase({
  tokenString = sampleUserToken,
  connection = dummyConnection,
}: {
  tokenString?: string;
  connection?: Connection;
}): Promise<void> {
  return new GetOnlineUseCase(
    Context.messageSender,
    Context.gateKeeper,
    Context.logger
  ).execute({
    tokenString,
    connection,
  });
}

beforeEach(() => {
  messageSenderSpy = new MessageSenderSpy();
  Context.messageSender = messageSenderSpy;
  Context.gateKeeper = new DefaultGateKeeper();
  Context.logger = new LoggerSpy();
});

testWithInvalidToken((tokenString) => {
  return executeUseCase({ tokenString });
});

testUserExtractionFailure(() => executeUseCase({}));

test('makes user available', async () => {
  await executeUseCase({});

  assertMakesUserAvailable();

  function assertMakesUserAvailable() {
    const calls = messageSenderSpy.makeCorrespondentAvailableCalls;
    expect(calls).toHaveLength(1);
    expect(calls[0]).toStrictEqual({
      connection: dummyConnection,
      correspondentUserId: DefaultGateKeeper.defaultUser.getId(),
    });
  }
});
