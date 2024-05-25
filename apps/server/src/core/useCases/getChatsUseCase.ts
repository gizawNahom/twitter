import { Limit } from '../valueObjects/limit';
import { Offset } from '../valueObjects/offset';
import { Token } from '../valueObjects/token';

export class GetChatsUseCase {
  async execute({
    tokenString,
    limitValue,
    offsetValue,
  }: GetChatsRequest): Promise<void> {
    new Token(tokenString);
    new Limit(limitValue);
    new Offset(offsetValue);
  }
}

export interface GetChatsRequest {
  tokenString: string;
  limitValue: number;
  offsetValue: number;
}
