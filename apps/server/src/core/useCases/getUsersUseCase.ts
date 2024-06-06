import { extractUser, makeSureUserIsAuthenticated } from '../domainServices';
import { Username } from '../entities/username';
import { GateKeeper } from '../ports/gateKeeper';
import { Logger } from '../ports/logger';
import { UserRepository } from '../ports/userRepository';
import { Limit } from '../valueObjects/limit';
import { Offset } from '../valueObjects/offset';
import { Token } from '../valueObjects/token';

export class GetUsersUseCase {
  constructor(
    private userRepository: UserRepository,
    private gateKeeper: GateKeeper,
    private logger: Logger
  ) {}

  async execute({
    tokenString,
    limitValue,
    offsetValue,
    usernameString,
  }: GetUserRequest) {
    const token = new Token(tokenString);
    const limit = new Limit(limitValue);
    const offset = new Offset(offsetValue);
    const username = new Username(usernameString);

    await this.getAuthenticatedUser(token);

    await this.userRepository.getUsers(username, limit, offset);
  }

  private async getAuthenticatedUser(token: Token) {
    const user = await extractUser(this.gateKeeper, this.logger, token);
    makeSureUserIsAuthenticated(user);
    return user;
  }
}

export interface GetUserRequest {
  tokenString: string;
  limitValue: number;
  offsetValue: number;
  usernameString: string;
}
