import { ReadMessagesUseCase } from '../../src/core/useCases/readMessagesUseCase';
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
  const uC = new ReadMessagesUseCase();
  return await uC.execute({ tokenString, limitValue, offsetValue });
}

testWithInvalidToken((token) => executeUseCase({ tokenString: token }));

testWithInvalidLimit((limitValue) => executeUseCase({ limitValue }));

testWithInvalidOffset((offsetValue) => executeUseCase({ offsetValue }));
