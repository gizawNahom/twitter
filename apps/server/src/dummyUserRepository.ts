import { User } from './core/entities/user';
import { UserRepository } from './core/ports/userRepository';

export class DummyUserRepository implements UserRepository {
  async getById(): Promise<User | null> {
    return new User('userId1');
  }
}
