import { LogMessages } from '../logMessages';
import { GateKeeper } from '../ports/gateKeeper';
import { Logger } from '../ports/logger';
import { Token } from '../valueObjects/token';

export async function extractUser(
  gateKeeper: GateKeeper,
  logger: Logger,
  token: Token
) {
  const user = await gateKeeper.extractUser(token.getToken());
  logInfo(LogMessages.EXTRACTED_USER, { userId: user?.getId() });
  return user;

  function logInfo(logMessage: string, object?: object) {
    logger.logInfo(logMessage, object);
  }
}
