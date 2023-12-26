import { User } from '../../src/core/entities/user';
import { GateKeeper } from '../../src/core/ports/gateKeeper';

export class FailureGateKeeperStub implements GateKeeper {
  async extractUser(): Promise<User | null> {
    return null;
  }
}
