import { GateKeeper } from './core/ports/gateKeeper';
import { User } from './core/entities/user';

export class DefaultGateKeeper implements GateKeeper {
  static defaultUser: User = new User('123abc');
  async extractUser(): Promise<User | null> {
    return DefaultGateKeeper.defaultUser;
  }
}
