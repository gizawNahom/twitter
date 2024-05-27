import { extractUser, makeSureUserIsAuthenticated } from '../domainServices';
import { Chat } from '../entities/chat';
import { User } from '../entities/user';
import { GateKeeper } from '../ports/gateKeeper';
import { Logger } from '../ports/logger';
import { MessageGateway } from '../ports/messageGateway';
import { Limit } from '../valueObjects/limit';
import { Offset } from '../valueObjects/offset';
import { Token } from '../valueObjects/token';

export class GetChatsUseCase {
  constructor(
    private messageGateway: MessageGateway,
    private gateKeeper: GateKeeper,
    private logger: Logger
  ) {}

  async execute({
    tokenString,
    limitValue,
    offsetValue,
  }: GetChatsRequest): Promise<GetChatsResponse> {
    const { token, limit, offset } = this.createValueObjects(
      tokenString,
      limitValue,
      offsetValue
    );
    const user = await this.getAuthenticatedUser(token);
    const chats = await this.getChats(user, limit, offset);
    return this.buildResponse(chats);
  }

  private createValueObjects(
    tokenString: string,
    limitValue: number,
    offsetValue: number
  ) {
    const token = new Token(tokenString);
    const limit = new Limit(limitValue);
    const offset = new Offset(offsetValue);
    return { token, limit, offset };
  }

  private async getAuthenticatedUser(token: Token) {
    const user = await extractUser(this.gateKeeper, this.logger, token);
    makeSureUserIsAuthenticated(user);
    return user;
  }

  private async getChats(user: User, limit: Limit, offset: Offset) {
    return await this.messageGateway.getChats(user.getId(), limit, offset);
  }

  private buildResponse(chats: Chat[]) {
    return {
      chats: chats.map((c) => {
        return {
          id: c.getId(),
          createdAtISO: c.getCreatedAt().toISOString(),
        };
      }),
    };
  }
}

export interface GetChatsRequest {
  tokenString: string;
  limitValue: number;
  offsetValue: number;
}

export interface GetChatsResponse {
  chats: Array<{ id: string; createdAtISO: string }>;
}
