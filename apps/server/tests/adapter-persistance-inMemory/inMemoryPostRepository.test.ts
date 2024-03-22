import { Post } from '../../src/core/entities/post';
import { InMemoryPostRepository } from '../../src/adapter-persistance-inMemory/InMemoryPostRepository';
import { assertPostEquality } from '../utilities/assertions';
import { sampleUserId } from '../utilities/samples';
import { createPosts } from '../utilities/helpers';

let repo: InMemoryPostRepository;

function savePosts(posts: Post[]) {
  posts.forEach(async (p) => {
    await savePost(p);
  });

  async function savePost(post: Post) {
    await repo.save(post);
  }
}

function assertPostIsSaved(savedUsers: Post[] | null, post: Post) {
  expect(savedUsers?.findIndex((p) => p.isSame(post))).not.toBe(-1);
  expect(areDatesInSameHour(new Date(), post.getCreatedAt()));

  function areDatesInSameHour(date1: Date, date2: Date): boolean {
    return (
      date1.getFullYear() === date2.getFullYear() &&
      date1.getMonth() === date2.getMonth() &&
      date1.getDate() === date2.getDate() &&
      date1.getHours() === date2.getHours()
    );
  }
}

beforeEach(() => {
  repo = new InMemoryPostRepository();
});

test('saves post', async () => {
  const [p1] = createPosts(1);

  savePosts([p1]);

  const savedUsers = await repo.getAll(sampleUserId);
  assertPostIsSaved(savedUsers, p1);
});

test('saves multiple posts for the same user', async () => {
  const [p1, p2] = createPosts(2);

  savePosts([p1, p2]);

  const savedUsers = await repo.getAll(sampleUserId);
  expect(savedUsers?.length).toBe(2);
  assertPostIsSaved(savedUsers, p1);
  assertPostIsSaved(savedUsers, p2);
});

test('creates post ids that are sequential', async () => {
  const [p1, p2] = createPosts(2);

  savePosts([p1, p2]);

  const savedUsers = (await repo.getAll(sampleUserId)) as Post[];
  expect(savedUsers[0].getId()).toBe('postId1');
  expect(savedUsers[1].getId()).toBe('postId2');
});

describe('gets latest post', () => {
  test.each([
    [4, 2, 0, [3, 2]],
    [4, 2, 1, [1, 0]],
    [1, 3, 1, [0]],
    [0, 3, 1, []],
    [4, 3, 1, [0]],
    [4, 3, 2, []],
  ])(
    'with created(%s), limit(%s), offset(%s)',
    async (createCount, limit, offset, expectedIndexes) => {
      const posts = createPosts(createCount);

      savePosts(posts);

      const result = await repo.getLatestPosts(sampleUserId, limit, offset);
      expect(result).toHaveLength(expectedIndexes.length);
      for (let index = 0; index < result.length; index++) {
        assertPostEquality(result[index], posts[expectedIndexes[index]]);
      }
    }
  );
});
