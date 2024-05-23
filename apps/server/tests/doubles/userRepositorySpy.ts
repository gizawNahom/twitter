import { User } from '../../src/core/entities/user';
import { Username } from '../../src/core/entities/username';
import { UserRepository } from '../../src/core/ports/userRepository';

export class UserRepositorySpy implements UserRepository {
  doesUserExistCalls: { username: Username }[] = [];
  doesUserExistResponse: boolean;

  async doesUserExist(username: Username): Promise<boolean> {
    this.doesUserExistCalls.push({ username });
    return this.doesUserExistResponse;
  }

  getById(): Promise<User | null> {
    throw new Error('Method not implemented.');
  }
}
