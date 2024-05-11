import { CreateChatUseCase } from '../../src/core/useCases/createChatUseCase';
import { testWithInvalidToken } from '../utilities/tests';

testWithInvalidToken((tokenString) => {
  return new CreateChatUseCase().execute({ tokenString });
});
