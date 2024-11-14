import { User } from '../../src/core/entities/user';
import { Username } from '../../src/core/entities/username';
import { UserRepository } from '../../src/core/ports/userRepository';
import { Limit } from '../../src/core/valueObjects/limit';
import { Offset } from '../../src/core/valueObjects/offset';

test("returns null if user can't be found", async () => {
  const repo = new PostgresUserRepository();

  const user = await repo.getById('userId1');

  expect(user).toBeNull();
});

class PostgresUserRepository implements UserRepository {
  async getById(userId: string): Promise<User | null> {
    return null;
  }

  getUser(username: Username): Promise<User | null> {
    throw new Error('Method not implemented.');
  }

  getUsers(username: Username, limit: Limit, offset: Offset): Promise<User[]> {
    throw new Error('Method not implemented.');
  }
}
