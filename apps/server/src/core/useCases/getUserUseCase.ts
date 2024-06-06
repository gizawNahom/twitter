import { Limit } from '../valueObjects/limit';
import { Offset } from '../valueObjects/offset';
import { Token } from '../valueObjects/token';

export class GetUserUseCase {
  execute({ tokenString, limitValue, offsetValue }: GetUserRequest) {
    new Token(tokenString);
    new Limit(limitValue);
    new Offset(offsetValue);
  }
}

export interface GetUserRequest {
  tokenString: string;
  limitValue: number;
  offsetValue: number;
}
