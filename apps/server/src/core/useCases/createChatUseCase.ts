import { Token } from '../valueObjects/token';

export class CreateChatUseCase {
  async execute({ tokenString }: CreateChatRequest) {
    new Token(tokenString);
  }
}

export interface CreateChatRequest {
  tokenString: string;
}
