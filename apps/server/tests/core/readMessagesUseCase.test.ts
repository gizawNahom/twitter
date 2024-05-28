import { ReadMessagesUseCase } from '../../src/core/useCases/readMessagesUseCase';
import { sampleLimit, sampleUserToken } from '../utilities/samples';
import { testWithInvalidLimit, testWithInvalidToken } from '../utilities/tests';

async function executeUseCase({
  tokenString = sampleUserToken,
  limitValue = sampleLimit,
}: {
  tokenString?: string;
  limitValue?: number;
}) {
  const uC = new ReadMessagesUseCase();
  return await uC.execute({ tokenString, limitValue });
}

testWithInvalidToken((token) => executeUseCase({ tokenString: token }));

testWithInvalidLimit((limitValue) => executeUseCase({ limitValue }));
