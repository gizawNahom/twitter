import { createServer } from '../../src/adapter-api-express/server';
import Context from '../../src/adapter-api-express/context';
import { Post } from '../../src/core/entities/post';
import { DefaultGateKeeper } from '../../src/adapter-api-express/defaultGateKeeper';
import request from 'supertest';
import { sampleUserId } from './samples';
import { Message } from '../../src/core/entities/message';
import { MessageResponse } from '../../src/core/useCases/readMessagesUseCase';

export function removeSeconds(isoString: string) {
  return isoString.slice(0, isoString.lastIndexOf(':'));
}

export async function getSavedPosts(): Promise<Post[]> {
  const userId = DefaultGateKeeper.defaultUser.getId();
  const savedPosts = await Context.postRepository.getAll(userId);
  return savedPosts as Post[];
}

export async function sendRequest(query: string, variables: unknown) {
  return await request(createServer())
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

export function getRandomPort() {
  return Math.floor(Math.random() * 5000) + 5000;
}

export function buildMessageResponse(message: Message): MessageResponse {
  return {
    id: message.getId(),
    senderId: message.getSenderId(),
    chatId: message.getChatId(),
    text: message.getText(),
    createdAt: message.getCreatedAt().toISOString(),
  };
}
