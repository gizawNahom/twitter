import { ReadMessagesUseCase } from '../../src/core/useCases/readMessagesUseCase';
import { sampleUserToken } from '../utilities/samples';
import { testWithInvalidToken } from '../utilities/tests';

async function executeUseCase({
  tokenString = sampleUserToken,
}: {
  tokenString?: string;
}) {
  const uC = new ReadMessagesUseCase();
  return await uC.execute({ tokenString });
}

testWithInvalidToken((token) => executeUseCase({ tokenString: token }));
