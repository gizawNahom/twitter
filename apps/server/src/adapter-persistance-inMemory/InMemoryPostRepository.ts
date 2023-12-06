import { Post } from '../core/post';
import { PostRepository } from '../core/postRepository';

export class InMemoryPostRepository implements PostRepository {
  private posts: Array<Post> = [];

  async getAll(userId: string): Promise<Array<Post> | null> {
    return this.posts.filter((p) => {
      return p.getId() !== userId;
    }) as Post[];
  }

  async getById(postId: string): Promise<Post | null> {
    return this.posts.find((p) => p.getId() === postId) as Post;
  }

  async save(post: Post) {
    post.setCreatedAt(new Date());
    this.posts.push(post);
  }
}
