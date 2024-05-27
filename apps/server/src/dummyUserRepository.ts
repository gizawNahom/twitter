import { User } from './core/entities/user';
import { UserRepository } from './core/ports/userRepository';

export class DummyUserRepository implements UserRepository {
  async getUserId(): Promise<string | null> {
    return '';
  }

  async getById(): Promise<User | null> {
    return new User('userId1');
  }

  async getUser(): Promise<User | null> {
    return null;
  }
}
