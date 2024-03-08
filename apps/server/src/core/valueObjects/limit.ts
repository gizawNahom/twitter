import { ValidationError } from '../errors';
import { ValidationMessages } from '../validationMessages';

export class Limit {
  constructor(limit: number) {
    if (this.isLimitInvalid(limit)) this.throwLimitInvalidError();
  }

  private isLimitInvalid(limit: number) {
    return limit <= 0 || limit > 20;
  }

  private throwLimitInvalidError() {
    throw new ValidationError(ValidationMessages.INVALID_LIMIT);
  }
}
