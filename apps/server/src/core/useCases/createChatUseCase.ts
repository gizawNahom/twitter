import { extractUser, makeSureUserIsAuthenticated } from '../domainServices';
import { Username } from '../entities/username';
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
    new Username(usernameString);
    makeSureUserIsAuthenticated(
      await extractUser(this.gateKeeper, this.logger, token)
    );
  }
}

export interface CreateChatRequest {
  tokenString: string;
  usernameString: string;
}
