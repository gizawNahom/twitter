import { Post } from '../../src/core/post';
import { PostRepository } from '../../src/core/postRepository';

export class PostRepositoryNullStub implements PostRepository {
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
