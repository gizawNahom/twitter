import { Message } from '../entities/message';
import { Connection } from '../entities/connection';

export interface MessageSender {
  isCorrespondentAvailable(correspondentUserId: string): Promise<boolean>;
  sendMessage(message: Message, correspondentUserId: string): Promise<void>;
  makeCorrespondentAvailable(
    connection: Connection,
    correspondentUserId: string
  ): Promise<void>;
}
