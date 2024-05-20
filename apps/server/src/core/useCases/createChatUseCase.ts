import { ValidationError } from '../errors';
import { ValidationMessages } from '../validationMessages';
import { Token } from '../valueObjects/token';

export class CreateChatUseCase {
  async execute({ tokenString }: CreateChatRequest): Promise<void> {
    new Token(tokenString);
    throw new ValidationError(ValidationMessages.USERNAME_INVALID);
  }
}

export interface CreateChatRequest {
  tokenString: string;
  username: string;
}
