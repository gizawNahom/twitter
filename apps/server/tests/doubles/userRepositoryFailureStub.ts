import { User } from '../../src/core/entities/user';
import { UserRepository } from '../../src/core/ports/userRepository';

export class UserRepositoryFailureStub implements UserRepository {
  getByUsername(): Promise<User | null> {
    throw new Error('Method not implemented.');
  }

  async getById(): Promise<User | null> {
    return null;
  }

  async getUsers(): Promise<User[]> {
    return [];
  }
}
