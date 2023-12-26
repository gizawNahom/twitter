import { User } from '../../src/core/user';
import { GateKeeper } from '../../src/core/gateKeeper';

export class FailureGateKeeperStub implements GateKeeper {
  async extractUser(): Promise<User | null> {
    return null;
  }
}
