import {
  extractUser,
  makeSureUserIsAuthenticated,
  sanitizeXSSString,
} from '../domainServices';
import { ValidationError } from '../errors';
import { MessageGateway } from '../ports/messageGateway';
import { GateKeeper } from '../ports/gateKeeper';
import { ValidationMessages } from '../validationMessages';
import { Token } from '../valueObjects/token';
import { Message } from '../entities/message';
import { IdGenerator } from '../ports/idGenerator';
import { ChatId } from '../valueObjects/chatId';
import { MessageSender } from '../ports/messageSender';
import { Logger } from '../ports/logger';
import { User } from '../entities/user';
import { MessageText } from '../valueObjects/messageText';
import { MessageBuilder } from '../messageBuilder';

export class SendMessageUseCase {
  constructor(
    private gateKeeper: GateKeeper,
    private messageGateway: MessageGateway,
    private idGenerator: IdGenerator,
    private messageSender: MessageSender,
    private logger: Logger
  ) {}

  async execute({ token, text, chatId }: SendMessageRequest) {
    const cId = new ChatId(chatId);
    const t = new Token(token);
    const msgTxt = new MessageText(sanitizeXSSString(text));

    const user = await extractUser(this.gateKeeper, this.logger, t);
    makeSureUserIsAuthenticated(user);

    await this.ensureChatExists(cId);

    const message = this.buildMessage(user, cId, msgTxt);
    await this.saveMessage(message);

    await this.sendMessage(await this.getCorrespondentId(cId, user), message);
  }

  private async ensureChatExists(chatId: ChatId) {
    if (!(await this.messageGateway.doesChatExist(chatId)))
      this.throwValidationError(ValidationMessages.CHAT_DOES_NOT_EXIST);
  }

  private throwValidationError(errorMessage: ValidationMessages) {
    throw new ValidationError(errorMessage);
  }

  private buildMessage(user: User, chatId: ChatId, msgText: MessageText) {
    return MessageBuilder.message()
      .withId(this.idGenerator.generate())
      .withSenderId(user.getId())
      .withChatId(chatId)
      .withText(msgText)
      .withCreatedAt(new Date())
      .build();
  }

  private async saveMessage(msg: Message) {
    await this.messageGateway.saveMessage(msg);
  }

  private async getCorrespondentId(cId: ChatId, user: User) {
    return await this.messageGateway.getCorrespondentId(cId, user.getId());
  }

  private async sendMessage(recipientId: string, msg: Message) {
    if (await this.messageSender.isRecipientAvailable(recipientId))
      await this.messageSender.sendMessage(msg, recipientId);
  }
}

export interface SendMessageRequest {
  token: string;
  text: string;
  chatId: string;
}
