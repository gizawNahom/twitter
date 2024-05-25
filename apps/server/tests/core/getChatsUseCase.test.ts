import { GetChatsUseCase } from '../../src/core/useCases/getChatsUseCase';
import { sampleLimit, sampleUserToken } from '../utilities/samples';
import { testWithInvalidLimit, testWithInvalidToken } from '../utilities/tests';

function executeUseCase({
  tokenString = sampleUserToken,
  limitValue = sampleLimit,
}: {
  tokenString?: string;
  limitValue?: number;
}): Promise<void> {
  return new GetChatsUseCase().execute({
    tokenString,
    limitValue,
  });
}

testWithInvalidToken((tokenString) => {
  return executeUseCase({ tokenString });
});

testWithInvalidLimit((limitValue) => executeUseCase({ limitValue }));
