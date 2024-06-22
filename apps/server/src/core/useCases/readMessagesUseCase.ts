import { getUserOrThrow } from '../domainServices';
import { Chat } from '../entities/chat';
import { Message } from '../entities/message';
import { User } from '../entities/user';
import { ValidationError } from '../errors';
import { GateKeeper } from '../ports/gateKeeper';
import { Logger } from '../ports/logger';
import { MessageGateway } from '../ports/messageGateway';
import { ValidationMessages } from '../validationMessages';
import { ChatId } from '../valueObjects/chatId';
import { Limit } from '../valueObjects/limit';
import { Offset } from '../valueObjects/offset';
import { Token } from '../valueObjects/token';

export class ReadMessagesUseCase {
  constructor(
    private messageGateway: MessageGateway,
    private gateKeeper: GateKeeper,
    private logger: Logger
  ) {}

  async execute(request: ReadMessagesRequest): Promise<ReadMessagesResponse> {
    const { token, chatId, limit, offset } = this.createValueObjects(request);
    const user = await this.getUserOrThrow(token);
    const chat = await this.getChatOrThrow(chatId);
    this.makeSureUserIsAllowedToReadChat(user, chat);
    return this.buildResponse(await this.getMessages(chatId, limit, offset));
  }

  private createValueObjects({
    tokenString,
    limitValue,
    offsetValue,
    chatIdString,
  }: ReadMessagesRequest) {
    const token = new Token(tokenString);
    const limit = new Limit(limitValue);
    const offset = new Offset(offsetValue);
    const chatId = new ChatId(chatIdString);
    return { token, chatId, limit, offset };
  }

  private async getUserOrThrow(token: Token) {
    return getUserOrThrow(token, this.gateKeeper, this.logger);
  }

  private async getChatOrThrow(chatId: ChatId) {
    const chat = await this.getChat(chatId);
    this.makeSureChatExists(chat);
    return chat;
  }

  private async getChat(chatId: ChatId) {
    return await this.messageGateway.getChatWithId(chatId);
  }

  private makeSureChatExists(chat: Chat) {
    if (!chat)
      this.throwValidationError(ValidationMessages.CHAT_DOES_NOT_EXIST);
  }

  private makeSureUserIsAllowedToReadChat(user: User, chat: Chat) {
    if (this.isParticipant(chat, user))
      this.throwValidationError(ValidationMessages.NOT_PARTICIPANT);
  }

  private throwValidationError(message: ValidationMessages) {
    throw new ValidationError(message);
  }

  private isParticipant(chat: Chat, user: User) {
    return (
      chat.getParticipants().filter((p) => p.getId() === user.getId())
        .length === 0
    );
  }

  private async getMessages(chatId: ChatId, limit: Limit, offset: Offset) {
    return await this.messageGateway.getMessages(chatId, limit, offset);
  }

  private buildResponse(messages: Message[]): ReadMessagesResponse {
    return {
      messages: messages.map((m) => {
        return {
          id: m.getId(),
          senderId: m.getSenderId(),
          chatId: m.getChatId(),
          text: m.getText(),
          createdAt: m.getCreatedAt().toISOString(),
        };
      }),
    };
  }
}

export interface ReadMessagesRequest {
  tokenString: string;
  limitValue: number;
  offsetValue: number;
  chatIdString: string;
}

export interface MessageResponse {
  id: string;
  senderId: string;
  chatId: string;
  text: string;
  createdAt: string;
}

export interface ReadMessagesResponse {
  messages: MessageResponse[];
}
