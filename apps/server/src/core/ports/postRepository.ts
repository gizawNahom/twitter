import { Post } from '../entities/post';

export interface PostRepository {
  getAll(userId: string): Promise<Array<Post> | null>;
  getById(postId: string): Promise<Post | null>;
  save(post: Post): Promise<void>;
  getLatestPosts(
    userId: string,
    limit: number,
    offset: number
  ): Promise<Array<Post>>;
}
