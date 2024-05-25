import { extractUser, makeSureUserIsAuthenticated } from '../domainServices';
import { GateKeeper } from '../ports/gateKeeper';
import { Logger } from '../ports/logger';
import { Limit } from '../valueObjects/limit';
import { Offset } from '../valueObjects/offset';
import { Token } from '../valueObjects/token';

export class GetChatsUseCase {
  constructor(private gateKeeper: GateKeeper, private logger: Logger) {}

  async execute({
    tokenString,
    limitValue,
    offsetValue,
  }: GetChatsRequest): Promise<void> {
    const token = new Token(tokenString);
    new Limit(limitValue);
    new Offset(offsetValue);

    makeSureUserIsAuthenticated(
      await extractUser(this.gateKeeper, this.logger, token)
    );
  }
}

export interface GetChatsRequest {
  tokenString: string;
  limitValue: number;
  offsetValue: number;
}
