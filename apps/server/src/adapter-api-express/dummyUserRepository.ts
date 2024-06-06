import { User } from '../core/entities/user';
import { Username } from '../core/entities/username';
import { UserRepository } from '../core/ports/userRepository';

export class DummyUserRepository implements UserRepository {
  async getUserId(): Promise<string | null> {
    return '';
  }

  async getById(): Promise<User | null> {
    return new User(
      'userId1',
      new Username('dummy'),
      'displayName',
      'https://sample'
    );
  }

  async getUser(): Promise<User | null> {
    return null;
  }

  async getUsers(): Promise<User[]> {
    return [];
  }
}
