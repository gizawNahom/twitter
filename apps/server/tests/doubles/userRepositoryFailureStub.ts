import { User } from '../../src/core/entities/user';
import { UserRepository } from '../../src/core/ports/userRepository';

export class UserRepositoryFailureStub implements UserRepository {
  async getUserId(): Promise<string | null> {
    return null;
  }

  async getById(): Promise<User | null> {
    return null;
  }
}
