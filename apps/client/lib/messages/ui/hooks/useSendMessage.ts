import { useState } from 'react';
import { useAuth } from '../../../auth/authContext';
import { Context } from '../../context';
import { MessageModel } from '../../adapters/controllers/sendMessage/messageModel';

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
      const message = await Context.sendMessageController.sendMessage({
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
