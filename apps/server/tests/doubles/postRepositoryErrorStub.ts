import { PostRepository } from '../../src/core/ports/postRepository';
import { Post } from '../../src/core/entities/post';

export class PostRepositoryErrorStub implements PostRepository {
  static readonly ERROR_MESSAGE = 'Unexpected error';

  getAll(): Promise<Post[] | null> {
    throw new Error(PostRepositoryErrorStub.ERROR_MESSAGE);
  }
  getById(): Promise<Post | null> {
    throw new Error(PostRepositoryErrorStub.ERROR_MESSAGE);
  }
  save(): Promise<void> {
    throw new Error(PostRepositoryErrorStub.ERROR_MESSAGE);
  }
  getLatestPosts(): Promise<Post[]> {
    throw new Error(PostRepositoryErrorStub.ERROR_MESSAGE);
  }
}
