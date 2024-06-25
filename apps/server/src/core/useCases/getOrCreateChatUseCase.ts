import { getUserOrThrow } from '../domainServices';
import { Chat } from '../entities/chat';
import { User } from '../entities/user';
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
        await this.getParticipants(
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

  private async getParticipants([token, username]: [Token, Username]): Promise<
    [User, User]
  > {
    const u1 = await this.getFirstParticipant(token);
    const u2 = await this.getSecondParticipant(username);
    return [u1, u2];
  }

  private async getFirstParticipant(token: Token) {
    return getUserOrThrow(token, this.gateKeeper, this.logger);
  }

  private async getSecondParticipant(username: Username) {
    const user = await this.getUser(username);
    this.makeSureUserExists(user);
    return user;
  }

  private async getUser(username: Username) {
    return await this.userRepository.getUser(username);
  }

  private makeSureUserExists(user: User) {
    if (!user)
      throw new ValidationError(ValidationMessages.USER_DOES_NOT_EXIST);
  }

  private async getOrCreateChat([u1, u2]: [User, User]) {
    let chat = await this.getChat(u1, u2);
    if (!chat) chat = await this.createChat(u1, u2);
    return chat;
  }

  private async getChat(u1: User, u2: User) {
    return await this.messageGateway.getChat(u1.getId(), u2.getId());
  }

  private async createChat(u1: User, u2: User) {
    const chat = this.buildChat(u1, u2);
    await this.saveChat(chat);
    return chat;
  }

  private async saveChat(chat: Chat) {
    await this.messageGateway.saveChat(chat);
  }

  private buildChat(u1: User, u2: User): Chat {
    return new Chat(new ChatId(this.generateId()), [u1, u2], new Date());
  }

  private generateId(): string {
    return this.idGenerator.generate();
  }

  private buildResponse(chat: Chat): GetOrCreateChatResponse {
    return {
      id: chat.getId(),
      createdAt: chat.getCreatedAt().toISOString(),
    };
  }
}

export interface GetOrCreateChatRequest {
  tokenString: string;
  usernameString: string;
}

export interface GetOrCreateChatResponse {
  id: string;
  createdAt: string;
}
