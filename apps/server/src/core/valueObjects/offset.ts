import { ValidationError } from '../errors';
import { ValidationMessages } from '../validationMessages';

export class Offset {
  constructor(offset: number) {
    if (this.isOffsetInvalid(offset)) this.throwInvalidOffsetError();
  }

  private isOffsetInvalid(offset: number) {
    return offset < 0;
  }

  private throwInvalidOffsetError() {
    throw new ValidationError(ValidationMessages.INVALID_OFFSET);
  }
}
