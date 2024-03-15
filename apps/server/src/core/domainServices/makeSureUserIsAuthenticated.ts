import { ValidationError } from '../errors';
import { ValidationMessages } from '../validationMessages';
import { User } from '../entities/user';

export function makeSureUserIsAuthenticated(user: User) {
  if (!isUserAuthenticated(user)) throwInvalidUserError();

  function isUserAuthenticated(user) {
    return user != null;
  }

  function throwInvalidUserError() {
    throw new ValidationError(ValidationMessages.INVALID_USER);
  }
}
