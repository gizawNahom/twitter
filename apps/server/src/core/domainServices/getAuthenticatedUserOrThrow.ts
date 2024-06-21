import { GateKeeper } from '../ports/gateKeeper';
import { Logger } from '../ports/logger';
import { Token } from '../valueObjects/token';
import { extractUser } from './extractUser';
import { makeSureUserIsAuthenticated } from './makeSureUserIsAuthenticated';

export async function getAuthenticatedUserOrThrow(
  token: Token,
  gateKeeper: GateKeeper,
  logger: Logger
) {
  const user = await extractUser(gateKeeper, logger, token);
  makeSureUserIsAuthenticated(user);
  return user;
}
