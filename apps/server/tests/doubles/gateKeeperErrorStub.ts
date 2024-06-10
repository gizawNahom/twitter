import { User } from '../../src/core/entities/user';
import { GateKeeper } from '../../src/core/ports/gateKeeper';

export class GateKeeperErrorStub implements GateKeeper {
  static readonly ERROR_MESSAGE = 'Unexpected error';

  extractUser(): Promise<User | null> {
    throw new Error(GateKeeperErrorStub.ERROR_MESSAGE);
  }
}
