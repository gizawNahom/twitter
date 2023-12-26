import { ValidationError } from '../errors';
import { ValidationMessages } from '../validationMessages';

export class Token {
  private token: string;

  constructor(token: string) {
    if (this.isTokenInvalid(token)) this.throwTokenInvalidError();
    this.token = token;
  }

  private isTokenInvalid(token: string) {
    return token === '' || token == null;
  }

  private throwTokenInvalidError() {
    throw new ValidationError(ValidationMessages.INVALID_TOKEN);
  }

  getToken(): string {
    return this.token;
  }
}
