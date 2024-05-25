import { GetChatsUseCase } from '../../src/core/useCases/getChatsUseCase';
import { sampleUserToken } from '../utilities/samples';
import { testWithInvalidToken } from '../utilities/tests';

function executeUseCase({
  tokenString = sampleUserToken,
}: {
  tokenString?: string;
}): Promise<void> {
  return new GetChatsUseCase().execute({
    tokenString,
  });
}

testWithInvalidToken((tokenString) => {
  return executeUseCase({ tokenString });
});
