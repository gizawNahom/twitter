import { useState } from 'react';
import { useAuth } from '../../../auth/authContext';
import { Context } from '../../context';
import { SendMessageUseCase } from '../../core/useCases/sendMessageUseCase';
import { formatTimeForMessage } from '../utilities';
import { Message } from '../../core/domain/message';

export function useSendMessage() {
  const [status, setStatus] = useState<'idle' | 'loading' | 'error'>('idle');
  const [message, setMessage] = useState<MessageModel | null>();
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
  ): Promise<MessageModel | null | undefined> {
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
      return message;
    } catch (error) {
      setStatus('error');
    }
  }
}

class SendMessageController {
  constructor(private sendMessageUseCase: SendMessageUseCase) {}

  async sendMessage({
    senderId,
    text,
    chatId,
  }: {
    senderId: string;
    text: string;
    chatId: string;
  }): Promise<MessageModel | null> {
    const message = await this.sendMessageUseCase.execute({
      senderId,
      text,
      chatId,
    });
    return this.buildMessageModel(message);
  }

  buildMessageModel(message: Message | null) {
    if (message)
      return {
        id: message.id,
        text: message.text,
        chatId: message.chatId,
        senderId: message.senderId,
        time: formatTimeForMessage(new Date(message.createdAt)),
      };
    return null;
  }
}

interface MessageModel {
  id: string;
  text: string;
  chatId: string;
  senderId: string;
  time: string;
}
