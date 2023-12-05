import { User } from './user';

export interface GateKeeper {
  extractUser(token: string): User | null;
}
