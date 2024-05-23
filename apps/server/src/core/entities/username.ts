import { ValidationError } from '../errors';
import { ValidationMessages } from '../validationMessages';

export class Username {
  constructor(usernameString: string) {
    this.validateString(usernameString);
  }

  private validateString(usernameString: string) {
    if (
      !isOfValidLength(getLength(usernameString)) ||
      !isOnlyWords(usernameString)
    )
      throwUsernameInvalidError();

    function getLength(usernameString: string) {
      return usernameString.trim().length;
    }

    function isOfValidLength(length: number) {
      return length > 4 && length <= 15;
    }

    function isOnlyWords(usernameString: string) {
      return /^[a-zA-Z0-9_]+$/.test(usernameString);
    }

    function throwUsernameInvalidError() {
      throw new ValidationError(ValidationMessages.USERNAME_INVALID);
    }
  }
}
