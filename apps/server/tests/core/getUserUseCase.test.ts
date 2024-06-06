import { GetUserUseCase } from '../../src/core/useCases/getUserUseCase';
import { sampleLimit, sampleUserToken } from '../utilities/samples';
import { testWithInvalidLimit, testWithInvalidToken } from '../utilities/tests';

async function executeUseCase({
  tokenString = sampleUserToken,
  limitValue = sampleLimit,
}: {
  tokenString?: string;
  limitValue?: number;
}) {
  const uC = new GetUserUseCase();
  return await uC.execute({ tokenString, limitValue });
}

testWithInvalidToken((tokenString) => executeUseCase({ tokenString }));

testWithInvalidLimit((limitValue) => executeUseCase({ limitValue }));
