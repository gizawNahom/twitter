import { Post } from '../../src/core/entities/post';
import { InMemoryPostRepository } from '../../src/adapter-persistance-inMemory/InMemoryPostRepository';

let repo: InMemoryPostRepository;

function createPosts(count: number): Post[] {
  const posts: Post[] = [];
  for (let i = 1; i < count + 1; i++) {
    const post = new Post();
    post.setId('postId' + i);
    post.setUserId('userId');
    posts.push(post);
  }
  return posts;
}

async function savePost(post: Post) {
  await repo.save(post);
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

  await savePost(p1);

  const savedUsers = await repo.getAll('userId');
  assertPostIsSaved(savedUsers, p1);
});

test('saves multiple posts for the same user', async () => {
  const [p1, p2] = createPosts(2);

  await savePost(p1);
  await savePost(p2);

  const savedUsers = await repo.getAll('userId');
  expect(savedUsers?.length).toBe(2);
  assertPostIsSaved(savedUsers, p1);
  assertPostIsSaved(savedUsers, p2);
});

test('creates post ids that sequential', async () => {
  const p1 = new Post();
  p1.setUserId('userId');
  const p2 = new Post();
  p2.setUserId('userId');

  await savePost(p1);
  await savePost(p2);

  const savedUsers = (await repo.getAll('userId')) as Post[];
  expect(savedUsers[0].getId()).toBe('postId1');
  expect(savedUsers[1].getId()).toBe('postId2');
});
