import Context from '../../src/context';
import { ReadMessagesUseCase } from '../../src/core/useCases/readMessagesUseCase';
import {
  sampleLimit,
  sampleOffset,
  sampleUserToken,
} from '../utilities/samples';
import {
  testUserExtractionFailure,
  testWithInvalidChatId,
  testWithInvalidLimit,
  testWithInvalidOffset,
  testWithInvalidToken,
} from '../utilities/tests';

const sampleChatId = 'chatId123';

async function executeUseCase({
  tokenString = sampleUserToken,
  limitValue = sampleLimit,
  offsetValue = sampleOffset,
  chatIdString = sampleChatId,
}: {
  tokenString?: string;
  limitValue?: number;
  offsetValue?: number;
  chatIdString?: string;
}) {
  const uC = new ReadMessagesUseCase(Context.gateKeeper, Context.logger);
  return await uC.execute({
    tokenString,
    limitValue,
    offsetValue,
    chatIdString,
  });
}

testWithInvalidToken((token) => executeUseCase({ tokenString: token }));

testWithInvalidLimit((limitValue) => executeUseCase({ limitValue }));

testWithInvalidOffset((offsetValue) => executeUseCase({ offsetValue }));

testWithInvalidChatId((chatIdString) => executeUseCase({ chatIdString }));

testUserExtractionFailure(() => executeUseCase({}));
