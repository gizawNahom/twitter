import { GetChatsUseCase } from '../../src/core/useCases/getChatsUseCase';
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

function executeUseCase({
  tokenString = sampleUserToken,
  limitValue = sampleLimit,
  offsetValue = sampleOffset,
}: {
  tokenString?: string;
  limitValue?: number;
  offsetValue?: number;
}): Promise<void> {
  return new GetChatsUseCase().execute({
    tokenString,
    limitValue,
    offsetValue,
  });
}

testWithInvalidToken((tokenString) => {
  return executeUseCase({ tokenString });
});

testWithInvalidLimit((limitValue) => executeUseCase({ limitValue }));

testWithInvalidOffset((offsetValue) => executeUseCase({ offsetValue }));
