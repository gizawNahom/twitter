import { InMemoryPostRepository } from './adapter-persistance-inMemory/InMemoryPostRepository';
import { GateKeeper } from './core/gateKeeper';
import { PostRepository } from './core/postRepository';
import { DefaultGateKeeper } from './defaultGateKeeper';

export default class Context {
  static postRepository: PostRepository = new InMemoryPostRepository();
  static gateKeeper: GateKeeper = new DefaultGateKeeper();
}
