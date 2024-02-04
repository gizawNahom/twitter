import { User } from '../entities/user';

export interface UserRepository {
  getById(userId: string): Promise<User | null>;
}
