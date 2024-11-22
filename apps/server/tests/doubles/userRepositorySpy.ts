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

  async getById(): Promise<User | null> {
    return new User(
      'userId1',
      new Username('dummy'),
      'displayName',
      'https://sample'
    );
  }

  async getByUsername(username: Username): Promise<User | null> {
    this.getUserCalls.push({ username });
    return this.getUserResponse;
  }

  async getUsersByUsername(
    username: Username,
    limit: Limit,
    offset: Offset
  ): Promise<User[]> {
    this.getUsersCalls.push({ username, limit, offset });
    return this.getUsersResponse;
  }
}
