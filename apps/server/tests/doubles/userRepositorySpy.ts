import { User } from '../../src/core/entities/user';
import { Username } from '../../src/core/entities/username';
import { UserRepository } from '../../src/core/ports/userRepository';

export class UserRepositorySpy implements UserRepository {
  getUserCalls: { username: Username }[] = [];
  getUserResponse: User | null;

  getById(): Promise<User | null> {
    throw new Error('Method not implemented.');
  }

  async getUser(username: Username): Promise<User | null> {
    this.getUserCalls.push({ username });
    return this.getUserResponse;
  }
}
