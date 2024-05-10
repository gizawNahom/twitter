import { ValidationError } from '../errors';
import { ValidationMessages } from '../validationMessages';

export class ChatId {
  private id: string;

  constructor(id: string) {
    this.validateId(id);
    this.id = id;
  }

  private validateId(id: string) {
    if (isEmpty(id)) throwValidationError(ValidationMessages.CHAT_ID_REQUIRED);

    function isEmpty(id: string) {
      return id.trim().length === 0;
    }

    function throwValidationError(errorMessage: ValidationMessages) {
      throw new ValidationError(errorMessage);
    }
  }

  getId() {
    return this.id;
  }
}
