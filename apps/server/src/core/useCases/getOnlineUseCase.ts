import { extractUser, makeSureUserIsAuthenticated } from '../domainServices';
import { GateKeeper } from '../ports/gateKeeper';
import { Logger } from '../ports/logger';
import { Token } from '../valueObjects/token';

export class GetOnlineUseCase {
  constructor(private gateKeeper: GateKeeper, private logger: Logger) {}

  async execute({ tokenString }: GetOnlineRequest) {
    const token = this.createToken(tokenString);
    await this.getAuthenticatedUser(token);
  }

  private createToken(tokenString: string) {
    return new Token(tokenString);
  }

  private async getAuthenticatedUser(token: Token) {
    const user = await extractUser(this.gateKeeper, this.logger, token);
    makeSureUserIsAuthenticated(user);
    return user;
  }
}

export interface GetOnlineRequest {
  tokenString: string;
}
