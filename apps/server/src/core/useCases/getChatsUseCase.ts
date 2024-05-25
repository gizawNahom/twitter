import { Limit } from '../valueObjects/limit';
import { Token } from '../valueObjects/token';

export class GetChatsUseCase {
  async execute({ tokenString, limitValue }: GetChatsRequest): Promise<void> {
    new Token(tokenString);
    new Limit(limitValue);
  }
}

export interface GetChatsRequest {
  tokenString: string;
  limitValue: number;
}
