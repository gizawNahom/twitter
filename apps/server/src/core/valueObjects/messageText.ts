import { ValidationError } from '../errors';
import { ValidationMessages } from '../validationMessages';

export class MessageText {
  private text: string;

  constructor(text: string) {
    this.validateText(text);
    this.text = text;
  }

  private validateText(text: string) {
    if (isMessageLongerThan1000Chars())
      this.throwValidationError(ValidationMessages.MESSAGE_TOO_LONG);
    if (isMessageEmpty())
      this.throwValidationError(ValidationMessages.MESSAGE_EMPTY);

    function isMessageLongerThan1000Chars() {
      return text.length > 1000;
    }

    function isMessageEmpty() {
      return text.trim().length === 0;
    }
  }

  private throwValidationError(errorMessage: ValidationMessages) {
    throw new ValidationError(errorMessage);
  }

  getText(): string {
    return this.text;
  }
}
