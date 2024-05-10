import {
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

export class SendMessageUseCase {
  constructor(
    private gateKeeper: GateKeeper,
    private messageGateway: MessageGateway,
    private idGenerator: IdGenerator,
    private messageSender: MessageSender
  ) {}

  async execute({ token, text, chatId }: SendMessageRequest) {
    const cId = new ChatId(chatId);
    const t = new Token(token);
    this.makeSureMessageIsValid(text);

    const user = await this.gateKeeper.extractUser(t.getToken());
    makeSureUserIsAuthenticated(user);

    await this.ensureChatExists(cId);

    const messageId = this.idGenerator.generate();
    const msg = new Message(
      messageId,
      user.getId(),
      chatId,
      sanitizeXSSString(text),
      new Date().toISOString()
    );
    await this.messageGateway.saveMessage(msg);
    const correspondentId = await this.messageGateway.getCorrespondentId(
      cId,
      user.getId()
    );
    if (await this.messageSender.isRecipientAvailable(correspondentId)) {
      this.messageSender.sendMessage(msg, correspondentId);
    }
  }

  private makeSureMessageIsValid(message: string) {
    if (isMessageLongerThan1000Chars())
      this.throwValidationError(ValidationMessages.MESSAGE_TOO_LONG);
    if (isMessageEmpty())
      this.throwValidationError(ValidationMessages.MESSAGE_EMPTY);

    function isMessageLongerThan1000Chars() {
      return message.length > 1000;
    }

    function isMessageEmpty() {
      return message.trim().length === 0;
    }
  }

  private async ensureChatExists(chatId: ChatId) {
    if (!(await this.messageGateway.doesChatExist(chatId)))
      this.throwValidationError(ValidationMessages.CHAT_DOES_NOT_EXIST);
  }

  private throwValidationError(errorMessage: ValidationMessages) {
    throw new ValidationError(errorMessage);
  }
}

export interface SendMessageRequest {
  token: string;
  text: string;
  chatId: string;
}
