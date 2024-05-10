import { Message } from '../entities/message';

export interface MessageSender {
  isRecipientAvailable(userId: string): Promise<boolean>;
  sendMessage(message: Message, recipientUserId: string): Promise<void>;
}
