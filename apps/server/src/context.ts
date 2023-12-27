import { DummyLogger } from './DummyLogger';
import { InMemoryPostRepository } from './adapter-persistance-inMemory/InMemoryPostRepository';
import { GateKeeper } from './core/ports/gateKeeper';
import { Logger } from './core/ports/logger';
import { PostRepository } from './core/ports/postRepository';
import { DefaultGateKeeper } from './defaultGateKeeper';

export default class Context {
  static postRepository: PostRepository = new InMemoryPostRepository();
  static gateKeeper: GateKeeper = new DefaultGateKeeper();
  static logger: Logger = new DummyLogger();
}
