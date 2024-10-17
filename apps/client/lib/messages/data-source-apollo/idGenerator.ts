export interface IdGenerator {
  generateId(): string;
}

export class RandomIdGenerator implements IdGenerator {
  generateId(): string {
    return `${Math.floor(Math.random() * 100000)}`;
  }
}
