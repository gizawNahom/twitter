import Context from '../src/context';
import { Post } from '../src/core/post';
import { DefaultGateKeeper } from '../src/defaultGateKeeper';

export const ERROR_EMPTY_TEXT = "Text can't be empty";

export function removeSeconds(isoString: string) {
  return isoString.slice(0, isoString.lastIndexOf(':'));
}

export async function getSavedPosts(): Promise<Post[]> {
  const userId = DefaultGateKeeper.defaultUser.getId();
  const savedPosts = await Context.postRepository.getAll(userId);
  return savedPosts as Post[];
}
