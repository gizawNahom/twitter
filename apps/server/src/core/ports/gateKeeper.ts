import { User } from '../entities/user';

export interface GateKeeper {
  extractUser(token: string): Promise<User | null>;
}
