import { GetOnlineUseCase } from '../../src/core/useCases/getOnlineUseCase';
import { sampleUserToken } from '../utilities/samples';
import Context from '../../src/adapter-api-express/context';
import {
  testUserExtractionFailure,
  testWithInvalidToken,
} from '../utilities/tests';
import { DefaultGateKeeper } from '../../src/adapter-api-express/defaultGateKeeper';
import { LoggerSpy } from '../doubles/loggerSpy';

function executeUseCase({
  tokenString = sampleUserToken,
}: {
  tokenString?: string;
}): Promise<void> {
  return new GetOnlineUseCase(Context.gateKeeper, Context.logger).execute({
    tokenString,
  });
}

beforeEach(() => {
  Context.gateKeeper = new DefaultGateKeeper();
  Context.logger = new LoggerSpy();
});

testWithInvalidToken((tokenString) => {
  return executeUseCase({ tokenString });
});

testUserExtractionFailure(() => executeUseCase({}));
