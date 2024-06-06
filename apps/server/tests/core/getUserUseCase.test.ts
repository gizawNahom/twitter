import { GetUserUseCase } from '../../src/core/useCases/getUserUseCase';
import { sampleUserToken } from '../utilities/samples';
import { testWithInvalidToken } from '../utilities/tests';

async function executeUseCase({
  tokenString = sampleUserToken,
}: {
  tokenString?: string;
}) {
  const uC = new GetUserUseCase();
  return await uC.execute({ tokenString });
}

testWithInvalidToken((tokenString) => executeUseCase({ tokenString }));
