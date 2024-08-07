import { User } from '../entities/user';
import { Username } from '../entities/username';
import { Limit } from '../valueObjects/limit';
import { Offset } from '../valueObjects/offset';

export interface UserRepository {
  getById(userId: string): Promise<User | null>;
  getUser(username: Username): Promise<User | null>;
  getUsers(username: Username, limit: Limit, offset: Offset): Promise<User[]>;
}
