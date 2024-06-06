import Context from '../../src/context';
import { GetUsersUseCase } from '../../src/core/useCases/getUsersUseCase';
import { DefaultGateKeeper } from '../../src/defaultGateKeeper';
import { UserRepositorySpy } from '../doubles/userRepositorySpy';
import {
  sampleLimit,
  sampleOffset,
  sampleUser1,
  sampleUser2,
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

let userRepoSpy: UserRepositorySpy;

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
  const uC = new GetUsersUseCase(
    Context.userRepository,
    Context.gateKeeper,
    Context.logger
  );
  return await uC.execute({
    tokenString,
    limitValue,
    offsetValue,
    usernameString,
  });
}

beforeEach(() => {
  Context.gateKeeper = new DefaultGateKeeper();
  userRepoSpy = new UserRepositorySpy();
  Context.userRepository = userRepoSpy;
});

testWithInvalidToken((tokenString) => executeUseCase({ tokenString }));

testWithInvalidLimit((limitValue) => executeUseCase({ limitValue }));

testWithInvalidOffset((offsetValue) => executeUseCase({ offsetValue }));

testWithInvalidUsername((usernameString) => executeUseCase({ usernameString }));

testUserExtractionFailure(() => executeUseCase({}));

test('gets users', async () => {
  userRepoSpy.getUsersResponse = [sampleUser1, sampleUser2];

  await executeUseCase({});

  assertGetUsersCall();

  function assertGetUsersCall() {
    expect(userRepoSpy.getUsersCalls).toHaveLength(1);
    const call = userRepoSpy.getUsersCalls[0];
    expect(call.username.getUsername()).toBe(sampleUsername);
    expect(call.limit.getLimit()).toBe(sampleLimit);
    expect(call.offset.getOffset()).toBe(sampleOffset);
  }
});
