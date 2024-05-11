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
import { LogMessages } from '../logMessages';

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
    if (!(await this.doesChatExist(chatId)))
      this.throwValidationError(ValidationMessages.CHAT_DOES_NOT_EXIST);
  }

  private async doesChatExist(chatId: ChatId) {
    const exists = await this.messageGateway.doesChatExist(chatId);
    this.logInfo(LogMessages.CHECKED_CHAT_EXISTENCE, {
      chatId: chatId.getId(),
    });
    return exists;
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
    this.logInfo(LogMessages.SAVED_MESSAGE, { messageId: msg.getId() });
  }

  private async getCorrespondentId(cId: ChatId, user: User) {
    const id = await this.messageGateway.getCorrespondentId(cId, user.getId());
    this.logInfo(LogMessages.FETCHED_CORRESPONDENT_ID, {
      chatId: cId.getId(),
      correspondentId: id,
    });
    return id;
  }

  private async sendMessage(correspondentId: string, msg: Message) {
    if (await this.isCorrespondentAvailable(correspondentId))
      await this.send(msg, correspondentId);
  }

  private async isCorrespondentAvailable(correspondentId: string) {
    const status = await this.messageSender.isRecipientAvailable(
      correspondentId
    );
    this.logInfo(LogMessages.CHECKED_MESSAGE_CORRESPONDENT_AVAILABILITY, {
      wasAvailable: status,
      correspondentId,
    });
    return status;
  }

  private async send(msg: Message, correspondentId: string) {
    await this.messageSender.sendMessage(msg, correspondentId);
    this.logInfo(LogMessages.SENT_MESSAGE_TO_CORRESPONDENT, {
      messageId: msg.getId(),
      correspondentId: correspondentId,
    });
  }

  private logInfo(message: string, obj: object) {
    this.logger.logInfo(message, obj);
  }
}

export interface SendMessageRequest {
  token: string;
  text: string;
  chatId: string;
}
