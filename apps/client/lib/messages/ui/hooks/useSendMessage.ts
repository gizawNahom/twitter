import { useState } from 'react';
import { Message } from '../../core/domain/message';
import { useAuth } from '../../../auth/authContext';
import { Context } from '../../context';

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
      const message = await Context.sendMessageUseCase.execute({
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
