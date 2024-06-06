import { Limit } from '../valueObjects/limit';
import { Token } from '../valueObjects/token';

export class GetUserUseCase {
  execute({ tokenString, limitValue }: GetUserRequest) {
    new Token(tokenString);
    new Limit(limitValue);
  }
}

export interface GetUserRequest {
  tokenString: string;
  limitValue: number;
}
