import { getUserOrThrow } from '../domainServices';
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
    const user = await getUserOrThrow(token, this.gateKeeper, this.logger);
    const chats = await this.getChats(user, limit, offset);
    return this.buildResponse(chats, user);
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

  private async getChats(user: User, limit: Limit, offset: Offset) {
    return await this.messageGateway.getChats(user.getId(), limit, offset);
  }

  private buildResponse(chats: Chat[], user: User): GetChatsResponse {
    return {
      chats: chats.map((chat) => {
        return {
          id: chat.getId(),
          createdAtISO: chat.getCreatedAt().toISOString(),
          participant: this.buildParticipantResponse(
            this.getParticipant(chat, user)
          ),
        };
      }),
    };
  }

  private getParticipant(chat: Chat, user: User) {
    return chat.getParticipants().filter((u) => u.getId() !== user.getId())[0];
  }

  private buildParticipantResponse(participant: User): {
    username: string;
    displayName: string;
    profilePic: string;
  } {
    return {
      username: participant.getUsername(),
      displayName: participant.getDisplayName(),
      profilePic: participant.getProfilePic(),
    };
  }
}

export interface GetChatsRequest {
  tokenString: string;
  limitValue: number;
  offsetValue: number;
}

export interface GetChatsResponse {
  chats: Array<{
    id: string;
    createdAtISO: string;
    participant: {
      username: string;
      profilePic: string;
      displayName: string;
    };
  }>;
}
