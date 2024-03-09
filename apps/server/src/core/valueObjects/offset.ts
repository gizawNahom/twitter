import { ValidationError } from '../errors';
import { ValidationMessages } from '../validationMessages';

export class Offset {
  private offset: number;

  constructor(offset: number) {
    if (this.isOffsetInvalid(offset)) this.throwInvalidOffsetError();
    this.offset = offset;
  }

  private isOffsetInvalid(offset: number) {
    return offset < 0;
  }

  private throwInvalidOffsetError() {
    throw new ValidationError(ValidationMessages.INVALID_OFFSET);
  }

  getOffset() {
    return this.offset;
  }
}
