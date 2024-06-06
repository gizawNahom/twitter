import { GetUserUseCase } from '../../src/core/useCases/getUserUseCase';
import {
  sampleLimit,
  sampleOffset,
  sampleUserToken,
  sampleUsername,
} from '../utilities/samples';
import {
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
  const uC = new GetUserUseCase();
  return await uC.execute({
    tokenString,
    limitValue,
    offsetValue,
    usernameString,
  });
}

testWithInvalidToken((tokenString) => executeUseCase({ tokenString }));

testWithInvalidLimit((limitValue) => executeUseCase({ limitValue }));

testWithInvalidOffset((offsetValue) => executeUseCase({ offsetValue }));

testWithInvalidUsername((usernameString) => executeUseCase({ usernameString }));
