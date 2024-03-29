import { DummyLogger } from './dummyLogger';
import { InMemoryPostRepository } from './adapter-persistance-inMemory/InMemoryPostRepository';
import { GateKeeper } from './core/ports/gateKeeper';
import { Logger } from './core/ports/logger';
import { PostRepository } from './core/ports/postRepository';
import { DefaultGateKeeper } from './defaultGateKeeper';
import { UserRepository } from './core/ports/userRepository';
import { DummyUserRepository } from './dummyUserRepository';
import { PostIndexGateway } from './core/ports/postIndexGateway';

export default class Context {
  static postRepository: PostRepository = new InMemoryPostRepository();
  static postIndexGateway: PostIndexGateway;
  static gateKeeper: GateKeeper = new DefaultGateKeeper();
  static logger: Logger = new DummyLogger();
  static userRepository: UserRepository = new DummyUserRepository();
}
