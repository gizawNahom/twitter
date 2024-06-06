import { User } from '../../src/core/entities/user';
import { Username } from '../../src/core/entities/username';
import { UserRepository } from '../../src/core/ports/userRepository';
import { Limit } from '../../src/core/valueObjects/limit';
import { Offset } from '../../src/core/valueObjects/offset';

export class UserRepositorySpy implements UserRepository {
  getUserCalls: { username: Username }[] = [];
  getUserResponse: User | null;
  getUsersResponse: User[];
  getUsersCalls: { username: Username; limit: Limit; offset: Offset }[] = [];

  getById(): Promise<User | null> {
    throw new Error('Method not implemented.');
  }

  async getUser(username: Username): Promise<User | null> {
    this.getUserCalls.push({ username });
    return this.getUserResponse;
  }

  async getUsers(
    username: Username,
    limit: Limit,
    offset: Offset
  ): Promise<User[]> {
    this.getUsersCalls.push({ username, limit, offset });
    return this.getUsersResponse;
  }
}
