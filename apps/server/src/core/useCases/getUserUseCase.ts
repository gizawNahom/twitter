import { Token } from '../valueObjects/token';

export class GetUserUseCase {
  execute({ tokenString }: GetUserRequest) {
    new Token(tokenString);
  }
}

export interface GetUserRequest {
  tokenString: string;
}
