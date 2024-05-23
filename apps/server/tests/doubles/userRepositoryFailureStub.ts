import { User } from '../../src/core/entities/user';
import { UserRepository } from '../../src/core/ports/userRepository';

export class UserRepositoryFailureStub implements UserRepository {
  async doesUserExist(): Promise<boolean> {
    return false;
  }
  async getById(): Promise<User | null> {
    return null;
  }
}
