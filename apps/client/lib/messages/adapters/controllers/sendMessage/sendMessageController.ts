import { SendMessageUseCase } from '../../../core/useCases/sendMessageUseCase';
import { MessagePresenter } from './messagePresenter';
import { MessageModel } from './messageModel';

export class SendMessageController {
  private messagePresenter: MessagePresenter = new MessagePresenter();

  constructor(private sendMessageUseCase: SendMessageUseCase) {}

  async sendMessage({
    senderId,
    text,
    chatId,
  }: {
    senderId: string;
    text: string;
    chatId: string;
  }): Promise<MessageModel> {
    const message = await this.sendMessageUseCase.execute({
      senderId,
      text,
      chatId,
    });
    return this.messagePresenter.toMessageModel(message);
  }
}
