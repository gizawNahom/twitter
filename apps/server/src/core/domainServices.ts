import { ValidationError } from './errors';
import { GateKeeper } from './gateKeeper';
import { LogMessages } from './logMessages';
import { Logger } from './logger';
import { ValidationMessages } from './validationMessages';

export async function checkUserAuthorization(
  gateKeeper: GateKeeper,
  logger: Logger,
  token: string
) {
  if (!isUserAuthenticated(await getUser(token))) throwInvalidUserError();

  async function getUser(token: string) {
    const user = await gateKeeper.extractUser(token);
    logInfo(LogMessages.EXTRACTED_USER);
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
