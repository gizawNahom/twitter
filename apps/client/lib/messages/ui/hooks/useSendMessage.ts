import { useState } from 'react';
import { useAuth } from '../../../auth/authContext';
import { Context } from '../../context';
import { SendMessageUseCase } from '../../core/useCases/sendMessageUseCase';
import { formatTimeForMessage } from '../utilities';
import { Message } from '../../core/domain/message';

export function useSendMessage() {
  const [status, setStatus] = useState<'idle' | 'loading' | 'error'>('idle');
  const [message, setMessage] = useState<MessageModel>();
  const { user } = useAuth();
  const senderId = user?.id || '';

  return {
    handleSendMessage,
    isLoading: status == 'loading',
    message: message,
  };

  async function handleSendMessage(
    text: string,
    chatId: string
  ): Promise<void> {
    try {
      setStatus('loading');
      const controller = new SendMessageController(Context.sendMessageUseCase);
      const message = await controller.sendMessage({
        senderId,
        text,
        chatId,
      });
      setMessage(message);
      setStatus('idle');
    } catch (error) {
      setStatus('error');
    }
  }
}

class SendMessageController {
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

interface MessageModel {
  id: string;
  text: string;
  chatId: string;
  senderId: string;
  time: string;
}

class MessagePresenter {
  toMessageModel(message: Message) {
    return {
      id: message.id,
      text: message.text,
      chatId: message.chatId,
      senderId: message.senderId,
      time: formatTimeForMessage(new Date(message.createdAt)),
    };
  }
}
