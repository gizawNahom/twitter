import { Limit } from '../valueObjects/limit';
import { Token } from '../valueObjects/token';

export class ReadMessagesUseCase {
  async execute({ tokenString, limitValue }: ReadMessagesRequest) {
    new Token(tokenString);
    new Limit(limitValue);
  }
}

export class ReadMessagesRequest {
  tokenString: string;
  limitValue: number;
}
