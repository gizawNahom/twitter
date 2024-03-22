import { app } from '../../src/app';
import Context from '../../src/context';
import { Post } from '../../src/core/entities/post';
import { DefaultGateKeeper } from '../../src/defaultGateKeeper';
import request from 'supertest';
import { sampleUserId } from './samples';

export function removeSeconds(isoString: string) {
  return isoString.slice(0, isoString.lastIndexOf(':'));
}

export async function getSavedPosts(): Promise<Post[]> {
  const userId = DefaultGateKeeper.defaultUser.getId();
  const savedPosts = await Context.postRepository.getAll(userId);
  return savedPosts as Post[];
}

export async function sendRequest(query: string, variables: unknown) {
  return await request(app).post('/graphql').send({
    query,
    variables,
  });
}

export function createPosts(count: number): Post[] {
  const posts: Post[] = [];
  for (let i = 1; i < count + 1; i++) {
    const post = new Post();
    post.setId('postId' + i);
    post.setUserId(sampleUserId);
    posts.push(post);
  }
  return posts;
}
