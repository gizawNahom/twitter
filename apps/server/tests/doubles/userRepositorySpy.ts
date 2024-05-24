import { User } from '../../src/core/entities/user';
import { Username } from '../../src/core/entities/username';
import { UserRepository } from '../../src/core/ports/userRepository';

export class UserRepositorySpy implements UserRepository {
  getUserIdCalls: { username: Username }[] = [];
  getUserIdResponse: string | null;

  getById(): Promise<User | null> {
    throw new Error('Method not implemented.');
  }

  async getUserId(username: Username): Promise<string | null> {
    this.getUserIdCalls.push({ username });
    return this.getUserIdResponse;
  }
}
