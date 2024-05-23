import { extractUser, makeSureUserIsAuthenticated } from '../domainServices';
import { ValidationError } from '../errors';
import { GateKeeper } from '../ports/gateKeeper';
import { Logger } from '../ports/logger';
import { ValidationMessages } from '../validationMessages';
import { Token } from '../valueObjects/token';

export class CreateChatUseCase {
  constructor(private gateKeeper: GateKeeper, private logger: Logger) {}

  async execute({
    tokenString,
    usernameString: usernameString,
  }: CreateChatRequest): Promise<void> {
    const token = new Token(tokenString);
    validateUsername(usernameString);
    makeSureUserIsAuthenticated(
      await extractUser(this.gateKeeper, this.logger, token)
    );

    function validateUsername(usernameString: string) {
      if (getLength(usernameString) <= 4 || !isOnlyWords(usernameString))
        throwUsernameInvalidError();

      function getLength(usernameString: string) {
        return usernameString.trim().length;
      }

      function isOnlyWords(usernameString: string) {
        return /^[a-zA-Z0-9_]+$/.test(usernameString);
      }

      function throwUsernameInvalidError() {
        throw new ValidationError(ValidationMessages.USERNAME_INVALID);
      }
    }
  }
}

export interface CreateChatRequest {
  tokenString: string;
  usernameString: string;
}
