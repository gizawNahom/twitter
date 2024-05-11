import { Message } from '../entities/message';

export interface MessageSender {
  isCorrespondentAvailable(correspondentUserId: string): Promise<boolean>;
  sendMessage(message: Message, correspondentUserId: string): Promise<void>;
}
