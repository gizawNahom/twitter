import { GetUserUseCase } from '../../src/core/useCases/getUserUseCase';
import {
  sampleLimit,
  sampleOffset,
  sampleUserToken,
} from '../utilities/samples';
import {
  testWithInvalidLimit,
  testWithInvalidOffset,
  testWithInvalidToken,
} from '../utilities/tests';

async function executeUseCase({
  tokenString = sampleUserToken,
  limitValue = sampleLimit,
  offsetValue = sampleOffset,
}: {
  tokenString?: string;
  limitValue?: number;
  offsetValue?: number;
}) {
  const uC = new GetUserUseCase();
  return await uC.execute({ tokenString, limitValue, offsetValue });
}

testWithInvalidToken((tokenString) => executeUseCase({ tokenString }));

testWithInvalidLimit((limitValue) => executeUseCase({ limitValue }));

testWithInvalidOffset((offsetValue) => executeUseCase({ offsetValue }));
