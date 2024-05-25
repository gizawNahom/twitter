import { Token } from '../valueObjects/token';

export class GetChatsUseCase {
  async execute({ tokenString }: GetChatsRequest): Promise<void> {
    new Token(tokenString);
  }
}

export interface GetChatsRequest {
  tokenString: string;
}
