import { extractUser, makeSureUserIsAuthenticated } from '../domainServices';
import { Connection } from '../entities/connection';
import { User } from '../entities/user';
import { GateKeeper } from '../ports/gateKeeper';
import { Logger } from '../ports/logger';
import { MessageSender } from '../ports/messageSender';
import { Token } from '../valueObjects/token';

export class GetOnlineUseCase {
  constructor(
    private messageSender: MessageSender,
    private gateKeeper: GateKeeper,
    private logger: Logger
  ) {}

  async execute({ tokenString, connection }: GetOnlineRequest) {
    const user = await this.getAuthenticatedUser(this.createToken(tokenString));
    this.makeUserAvailable(connection, user);
  }

  private createToken(tokenString: string) {
    return new Token(tokenString);
  }

  private async getAuthenticatedUser(token: Token) {
    const user = await extractUser(this.gateKeeper, this.logger, token);
    makeSureUserIsAuthenticated(user);
    return user;
  }

  private makeUserAvailable(connection: Connection, user: User) {
    this.messageSender.makeCorrespondentAvailable(connection, user.getId());
  }
}

export interface GetOnlineRequest {
  tokenString: string;
  connection: Connection;
}
