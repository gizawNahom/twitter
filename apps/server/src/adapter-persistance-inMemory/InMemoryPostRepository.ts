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

  async getLatestPosts(
    userId: string,
    limit: number,
    offset: number
  ): Promise<Array<Post>> {
    if (this.doesLimitExceedPostsLength(limit)) return this.getAllPosts(userId);
    return this.getPaginatedPosts(offset, limit, userId);
  }

  private doesLimitExceedPostsLength(limit: number) {
    return limit > this.posts.length;
  }

  private getPaginatedPosts(offset: number, limit: number, userId: string) {
    const start = offset * limit;
    return this.getAllPosts(userId).slice(start, start + limit);
  }

  private getAllPosts(userId: string): Post[] {
    return this.posts.filter((p) => p.getUserId() === userId).reverse();
  }
}
