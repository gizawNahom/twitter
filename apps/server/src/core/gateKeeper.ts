import { User } from './user';

export interface GateKeeper {
  extractUser(token: string): Promise<User | null>;
}
