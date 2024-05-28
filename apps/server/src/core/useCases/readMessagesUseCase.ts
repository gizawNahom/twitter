import { ChatId } from '../valueObjects/chatId';
import { Limit } from '../valueObjects/limit';
import { Offset } from '../valueObjects/offset';
import { Token } from '../valueObjects/token';

export class ReadMessagesUseCase {
  async execute({
    tokenString,
    limitValue,
    offsetValue,
    chatIdString,
  }: ReadMessagesRequest) {
    new Token(tokenString);
    new Limit(limitValue);
    new Offset(offsetValue);
    new ChatId(chatIdString);
  }
}

export class ReadMessagesRequest {
  tokenString: string;
  limitValue: number;
  offsetValue: number;
  chatIdString: string;
}
