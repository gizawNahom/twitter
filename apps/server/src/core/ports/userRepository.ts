import { User } from '../entities/user';
import { Username } from '../entities/username';

export interface UserRepository {
  getById(userId: string): Promise<User | null>;
  getUser(username: Username): Promise<User | null>;
}
