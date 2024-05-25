import { extractUser, makeSureUserIsAuthenticated } from '../domainServices';
import { Chat } from '../entities/chat';
import { Username } from '../entities/username';
import { ValidationError } from '../errors';
import { GateKeeper } from '../ports/gateKeeper';
import { IdGenerator } from '../ports/idGenerator';
import { Logger } from '../ports/logger';
import { MessageGateway } from '../ports/messageGateway';
import { UserRepository } from '../ports/userRepository';
import { ValidationMessages } from '../validationMessages';
import { ChatId } from '../valueObjects/chatId';
import { Token } from '../valueObjects/token';

export class GetOrCreateChatUseCase {
  constructor(
    private idGenerator: IdGenerator,
    private messageGateway: MessageGateway,
    private userRepository: UserRepository,
    private gateKeeper: GateKeeper,
    private logger: Logger
  ) {}

  async execute({
    tokenString,
    usernameString: usernameString,
  }: GetOrCreateChatRequest): Promise<GetOrCreateChatResponse> {
    return this.buildResponse(
      await this.getOrCreateChat(
        await this.getParticipantIds(
          this.createValueObjects(tokenString, usernameString)
        )
      )
    );
  }

  private createValueObjects(
    tokenString: string,
    usernameString: string
  ): [Token, Username] {
    const token = new Token(tokenString);
    const username = new Username(usernameString);
    return [token, username];
  }

  private async getParticipantIds([token, username]: [
    Token,
    Username
  ]): Promise<[string, string]> {
    const uId1 = await this.getFirstParticipantId(token);
    const uId2 = await this.getSecondParticipantId(username);
    return [uId1, uId2];
  }

  private async getFirstParticipantId(token: Token) {
    const user = await extractUser(this.gateKeeper, this.logger, token);
    makeSureUserIsAuthenticated(user);
    return user.getId();
  }

  private async getSecondParticipantId(username: Username) {
    const userId = await this.getUserId(username);
    this.makeSureUserExists(userId);
    return userId;
  }

  private async getUserId(username: Username) {
    return await this.userRepository.getUserId(username);
  }

  private makeSureUserExists(userId: string) {
    if (!userId)
      throw new ValidationError(ValidationMessages.USER_DOES_NOT_EXIST);
  }

  private async getOrCreateChat([uId1, uId2]: [string, string]) {
    let chat = await this.getChat(uId1, uId2);
    if (!chat) chat = await this.createChat(uId1, uId2);
    return chat;
  }

  private async getChat(uId1: string, uId2: string) {
    return await this.messageGateway.getChat(uId1, uId2);
  }

  private async createChat(uId1: string, uId2: string) {
    const chat = this.buildChat(uId1, uId2);
    await this.saveChat(chat);
    return chat;
  }

  private async saveChat(chat: Chat) {
    await this.messageGateway.saveChat(chat);
  }

  private buildChat(userId1: string, userId2: string) {
    return new Chat(
      new ChatId(this.generateId()),
      [userId1, userId2],
      new Date()
    );
  }

  private generateId(): string {
    return this.idGenerator.generate();
  }

  private buildResponse(chat: Chat): GetOrCreateChatResponse {
    return { chatId: chat.getId(), createdAt: chat.getCreatedAt() };
  }
}

export interface GetOrCreateChatRequest {
  tokenString: string;
  usernameString: string;
}

export interface GetOrCreateChatResponse {
  chatId: string;
  createdAt: Date;
}
