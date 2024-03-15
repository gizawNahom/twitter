import { ValidationError } from '../errors';
import { GateKeeper } from '../ports/gateKeeper';
import { LogMessages } from '../logMessages';
import { Logger } from '../ports/logger';
import { ValidationMessages } from '../validationMessages';
import { Token } from '../valueObjects/token';

export async function makeSureUserIsAuthenticated(
  gateKeeper: GateKeeper,
  logger: Logger,
  token: Token
) {
  if (!isUserAuthenticated(await getUser(token))) throwInvalidUserError();

  async function getUser(token: Token) {
    const user = await gateKeeper.extractUser(token.getToken());
    logInfo(LogMessages.EXTRACTED_USER, { userId: user?.getId() });
    return user;
  }

  function logInfo(logMessage: string, object?: object) {
    logger.logInfo(logMessage, object);
  }

  function isUserAuthenticated(user) {
    return user != null;
  }

  function throwInvalidUserError() {
    throw new ValidationError(ValidationMessages.INVALID_USER);
  }
}
