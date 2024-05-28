import { ReadMessagesUseCase } from '../../src/core/useCases/readMessagesUseCase';
import { assertValidationErrorWithMessage } from '../utilities/assertions';
import { ERROR_CHAT_ID_REQUIRED } from '../utilities/errorMessages';
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

const emptyString = ' \n\t\r';
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
  const uC = new ReadMessagesUseCase();
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

test('throws if the chat id is empty', () => {
  assertValidationErrorWithMessage(
    () => executeUseCase({ chatIdString: emptyString }),
    ERROR_CHAT_ID_REQUIRED
  );
});
