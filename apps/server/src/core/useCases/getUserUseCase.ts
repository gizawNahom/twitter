import { Username } from '../entities/username';
import { Limit } from '../valueObjects/limit';
import { Offset } from '../valueObjects/offset';
import { Token } from '../valueObjects/token';

export class GetUserUseCase {
  execute({
    tokenString,
    limitValue,
    offsetValue,
    usernameString,
  }: GetUserRequest) {
    new Token(tokenString);
    new Limit(limitValue);
    new Offset(offsetValue);
    new Username(usernameString);
  }
}

export interface GetUserRequest {
  tokenString: string;
  limitValue: number;
  offsetValue: number;
  usernameString: string;
}
