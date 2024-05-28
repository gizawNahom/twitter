import { extractUser, makeSureUserIsAuthenticated } from '../domainServices';
import { GateKeeper } from '../ports/gateKeeper';
import { Logger } from '../ports/logger';
import { ChatId } from '../valueObjects/chatId';
import { Limit } from '../valueObjects/limit';
import { Offset } from '../valueObjects/offset';
import { Token } from '../valueObjects/token';

export class ReadMessagesUseCase {
  constructor(private gateKeeper: GateKeeper, private logger: Logger) {}

  async execute({
    tokenString,
    limitValue,
    offsetValue,
    chatIdString,
  }: ReadMessagesRequest) {
    const token = new Token(tokenString);
    new Limit(limitValue);
    new Offset(offsetValue);
    new ChatId(chatIdString);

    makeSureUserIsAuthenticated(
      await extractUser(this.gateKeeper, this.logger, token)
    );
  }
}

export class ReadMessagesRequest {
  tokenString: string;
  limitValue: number;
  offsetValue: number;
  chatIdString: string;
}
