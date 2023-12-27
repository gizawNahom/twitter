import { ValidationError } from '../errors';
import { ValidationMessages } from '../validationMessages';

export class Token {
  private token: string;

  constructor(token: string) {
    if (this.isTokenInvalid(token)) this.throwTokenRequiredError();
    this.token = token;
  }

  private isTokenInvalid(token: string) {
    return token === '' || token == null;
  }

  private throwTokenRequiredError() {
    throw new ValidationError(ValidationMessages.TOKEN_REQUIRED);
  }

  getToken(): string {
    return this.token;
  }
}
