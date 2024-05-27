import { GateKeeper } from './core/ports/gateKeeper';
import { User } from './core/entities/user';
import { Username } from './core/entities/username';

export class DefaultGateKeeper implements GateKeeper {
  static defaultUser: User = new User(
    '123abc',
    new Username('default'),
    'displayName',
    'https://sample'
  );
  async extractUser(): Promise<User | null> {
    return DefaultGateKeeper.defaultUser;
  }
}
