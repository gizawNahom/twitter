import { extractUser, makeSureUserIsAuthenticated } from '../domainServices';
import { Username } from '../entities/username';
import { GateKeeper } from '../ports/gateKeeper';
import { Logger } from '../ports/logger';
import { Limit } from '../valueObjects/limit';
import { Offset } from '../valueObjects/offset';
import { Token } from '../valueObjects/token';

export class GetUsersUseCase {
  constructor(private gateKeeper: GateKeeper, private logger: Logger) {}

  async execute({
    tokenString,
    limitValue,
    offsetValue,
    usernameString,
  }: GetUserRequest) {
    const token = new Token(tokenString);
    new Limit(limitValue);
    new Offset(offsetValue);
    new Username(usernameString);

    await this.getAuthenticatedUser(token);
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
