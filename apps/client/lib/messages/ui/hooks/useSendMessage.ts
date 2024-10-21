import { useState } from 'react';
import { Message } from '../../core/domain/message';
import { useAuth } from '../../../auth/authContext';
import { Context } from '../../context';
import { SendMessageUseCase } from '../../core/useCases/sendMessageUseCase';

export function useSendMessage() {
  const [status, setStatus] = useState<'idle' | 'loading' | 'error'>('idle');
  const [message, setMessage] = useState<Message | null>();
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
  ): Promise<Message | null | undefined> {
    try {
      setStatus('loading');
      const controller = new SendMessageController(Context.sendMessageUseCase);
      const message = await controller.sendMessage({ senderId, text, chatId });
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
  }): Promise<Message> {
    return (await this.sendMessageUseCase.execute({
      senderId,
      text,
      chatId,
    })) as Message;
  }
}
