import { IdGenerator } from '../../src/core/ports/idGenerator';

export class IdGeneratorStub implements IdGenerator {
  STUB_ID = 'globallyUniqueId';
  generate(): string {
    return this.STUB_ID;
  }
}
