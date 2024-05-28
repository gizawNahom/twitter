import { Token } from '../valueObjects/token';

export class ReadMessagesUseCase {
  async execute({ tokenString }: ReadMessagesRequest) {
    new Token(tokenString);
  }
}

export class ReadMessagesRequest {
  tokenString: string;
}
