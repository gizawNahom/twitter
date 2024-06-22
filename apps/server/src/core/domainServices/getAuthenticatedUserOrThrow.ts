import { User } from '../entities/user';
import { ValidationError } from '../errors';
import { GateKeeper } from '../ports/gateKeeper';
import { Logger } from '../ports/logger';
import { ValidationMessages } from '../validationMessages';
import { Token } from '../valueObjects/token';
import { extractUser } from './extractUser';

export async function getAuthenticatedUserOrThrow(
  token: Token,
  gateKeeper: GateKeeper,
  logger: Logger
) {
  const user = await extractUser(gateKeeper, logger, token);
  makeSureUserIsAuthenticated(user);
  return user;
}

function makeSureUserIsAuthenticated(user: User) {
  if (!isUserAuthenticated(user)) throwInvalidUserError();
}

function isUserAuthenticated(user) {
  return user != null;
}

function throwInvalidUserError() {
  throw new ValidationError(ValidationMessages.INVALID_USER);
}
