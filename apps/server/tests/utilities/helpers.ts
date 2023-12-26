import Context from '../../src/context';
import { Post } from '../../src/core/entities/post';
import { DefaultGateKeeper } from '../../src/defaultGateKeeper';

export function removeSeconds(isoString: string) {
  return isoString.slice(0, isoString.lastIndexOf(':'));
}

export async function getSavedPosts(): Promise<Post[]> {
  const userId = DefaultGateKeeper.defaultUser.getId();
  const savedPosts = await Context.postRepository.getAll(userId);
  return savedPosts as Post[];
}
