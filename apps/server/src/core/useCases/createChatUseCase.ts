import { extractUser, makeSureUserIsAuthenticated } from '../domainServices';
import { Username } from '../entities/username';
import { ValidationError } from '../errors';
import { GateKeeper } from '../ports/gateKeeper';
import { Logger } from '../ports/logger';
import { UserRepository } from '../ports/userRepository';
import { ValidationMessages } from '../validationMessages';
import { Token } from '../valueObjects/token';

export class CreateChatUseCase {
  constructor(
    private userRepository: UserRepository,
    private gateKeeper: GateKeeper,
    private logger: Logger
  ) {}

  async execute({
    tokenString,
    usernameString: usernameString,
  }: CreateChatRequest): Promise<void> {
    const token = new Token(tokenString);
    const username = new Username(usernameString);
    makeSureUserIsAuthenticated(
      await extractUser(this.gateKeeper, this.logger, token)
    );
    if (!(await this.doesUserExist(username)))
      throw new ValidationError(ValidationMessages.USER_DOES_NOT_EXIST);
  }

  private async doesUserExist(username: Username) {
    return await this.userRepository.doesUserExist(username);
  }
}

export interface CreateChatRequest {
  tokenString: string;
  usernameString: string;
}
