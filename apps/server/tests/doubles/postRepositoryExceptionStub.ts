import { PostRepository } from '../../src/core/ports/postRepository';
import { Post } from '../../src/core/entities/post';

export class PostRepositoryExceptionStub implements PostRepository {
  static readonly ERROR_MESSAGE = 'Unexpected error';

  getAll(): Promise<Post[] | null> {
    throw new Error(PostRepositoryExceptionStub.ERROR_MESSAGE);
  }
  getById(): Promise<Post | null> {
    throw new Error(PostRepositoryExceptionStub.ERROR_MESSAGE);
  }
  save(): Promise<void> {
    throw new Error(PostRepositoryExceptionStub.ERROR_MESSAGE);
  }
}
