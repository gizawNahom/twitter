import { Post } from '../../src/core/entities/post';
import { PostRepository } from '../../src/core/ports/postRepository';

export class DummyPostRepository implements PostRepository {
  async getAll(): Promise<Post[] | null> {
    return null;
  }
  async getById(): Promise<Post | null> {
    return null;
  }
  async save(): Promise<void> {
    //
  }
}
