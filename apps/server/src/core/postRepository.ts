import { Post } from './post';

export interface PostRepository {
  getAll(userId: string): Promise<Array<Post> | null>;
  getById(postId: string): Promise<Post | null>;
  save(post: Post): Promise<void>;
}
