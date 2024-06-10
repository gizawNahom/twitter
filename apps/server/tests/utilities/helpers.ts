import { app } from '../../src/adapter-api-express/app';
import Context from '../../src/adapter-api-express/context';
import { Post } from '../../src/core/entities/post';
import { DefaultGateKeeper } from '../../src/adapter-api-express/defaultGateKeeper';
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
  return await request(app)
    .post('/graphql')
    .send({
      query,
      variables,
    })
    .set('Authorization', 'bearer userToken');
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

export function savePosts(posts: Post[]) {
  posts.forEach(async (p) => {
    await savePost(p);
  });

  async function savePost(post: Post) {
    await Context.postRepository.save(post);
  }
}
