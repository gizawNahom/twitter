import { extractUser, makeSureUserIsAuthenticated } from '../domainServices';
import { Chat } from '../entities/chat';
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

  async execute({
    tokenString,
    limitValue,
    offsetValue,
    chatIdString,
  }: ReadMessagesRequest) {
    const token = new Token(tokenString);
    new Limit(limitValue);
    new Offset(offsetValue);
    const chatId = new ChatId(chatIdString);

    const user = await extractUser(this.gateKeeper, this.logger, token);
    makeSureUserIsAuthenticated(user);

    const chat = await this.getChat(chatId);
    this.makeSureChatExists(chat);

    if (this.isParticipant(chat, user))
      this.throwValidationError(ValidationMessages.NOT_PARTICIPANT);
  }

  private async getChat(chatId: ChatId) {
    return await this.messageGateway.getChatWithId(chatId);
  }

  private makeSureChatExists(chat: Chat) {
    if (!chat)
      this.throwValidationError(ValidationMessages.CHAT_DOES_NOT_EXIST);
  }

  private isParticipant(chat: Chat, user: User) {
    return (
      chat.getParticipants().filter((p) => p.getId() === user.getId())
        .length === 0
    );
  }

  private throwValidationError(message: ValidationMessages) {
    throw new ValidationError(message);
  }
}

export class ReadMessagesRequest {
  tokenString: string;
  limitValue: number;
  offsetValue: number;
  chatIdString: string;
}
