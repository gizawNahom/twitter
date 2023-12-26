import { Post } from '../core/entities/post';
import { PostRepository } from '../core/ports/postRepository';

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
    if (this.isIdUndefined(post)) this.setId(post);
    post.setCreatedAt(new Date());
    this.posts.push(post);
  }

  private isIdUndefined(post: Post) {
    return post.getId() == null;
  }

  private setId(post: Post) {
    const idNum = this.posts.length + 1;
    post.setId('postId' + idNum);
  }
}
