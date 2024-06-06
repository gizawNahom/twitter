import Context from '../../src/context';
import { GetUsersUseCase } from '../../src/core/useCases/getUsersUseCase';
import { DefaultGateKeeper } from '../../src/defaultGateKeeper';
import {
  sampleLimit,
  sampleOffset,
  sampleUserToken,
  sampleUsername,
} from '../utilities/samples';
import {
  testUserExtractionFailure,
  testWithInvalidLimit,
  testWithInvalidOffset,
  testWithInvalidToken,
  testWithInvalidUsername,
} from '../utilities/tests';

async function executeUseCase({
  tokenString = sampleUserToken,
  limitValue = sampleLimit,
  offsetValue = sampleOffset,
  usernameString = sampleUsername,
}: {
  tokenString?: string;
  limitValue?: number;
  offsetValue?: number;
  usernameString?: string;
}) {
  const uC = new GetUsersUseCase(Context.gateKeeper, Context.logger);
  return await uC.execute({
    tokenString,
    limitValue,
    offsetValue,
    usernameString,
  });
}

beforeEach(() => {
  Context.gateKeeper = new DefaultGateKeeper();
});

testWithInvalidToken((tokenString) => executeUseCase({ tokenString }));

testWithInvalidLimit((limitValue) => executeUseCase({ limitValue }));

testWithInvalidOffset((offsetValue) => executeUseCase({ offsetValue }));

testWithInvalidUsername((usernameString) => executeUseCase({ usernameString }));

testUserExtractionFailure(() => executeUseCase({}));
