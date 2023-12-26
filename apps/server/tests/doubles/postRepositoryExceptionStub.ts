import { PostRepository } from '../../src/core/ports/postRepository';
import { Post } from '../../src/core/entities/post';

export class PostRepositoryExceptionStub implements PostRepository {
  getAll(): Promise<Post[] | null> {
    throw new Error('Method not implemented.');
  }
  getById(): Promise<Post | null> {
    throw new Error('Method not implemented.');
  }
  save(): Promise<void> {
    throw new Error('Method not implemented.');
  }
}
