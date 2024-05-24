import { User } from '../../src/core/entities/user';
import { Username } from '../../src/core/entities/username';
import { UserRepository } from '../../src/core/ports/userRepository';

export class UserRepositoryFailureStub implements UserRepository {
  async getUserId(username: Username): Promise<string | null> {
    return null;
  }

  async getById(): Promise<User | null> {
    return null;
  }
}
