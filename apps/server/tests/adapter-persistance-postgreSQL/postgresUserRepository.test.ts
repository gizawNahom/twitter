import { PostgresUserRepository } from '../../src/adapter-persistence-postgres/postgresUserRepository';
import { User } from '../../src/core/entities/user';
import { Username } from '../../src/core/entities/username';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

function createRepository(prismaClient = prisma) {
  return new PostgresUserRepository(prismaClient);
}

async function clearTable() {
  try {
    await prisma.$executeRaw`TRUNCATE TABLE "User";`;
    console.log('Table cleared successfully.');
  } catch (error) {
    console.error('Error clearing table:', error);
  }
}

function buildUser(userDTO: {
  id: string;
  username: string;
  displayName: string;
  profilePic: string;
}): User {
  return new User(
    userDTO.id,
    new Username(userDTO.username),
    userDTO.displayName,
    userDTO.profilePic
  );
}

async function saveUser(userDTO: {
  id: string;
  username: string;
  displayName: string;
  profilePic: string;
}): Promise<{
  id: string;
  username: string;
  displayName: string;
  profilePic: string;
}> {
  return await prisma.user.create({
    data: userDTO,
  });
}

beforeAll(async () => {
  await prisma.$connect();
});

beforeEach(async () => {
  await clearTable();
});

afterAll(async () => {
  await prisma.$disconnect();
});

describe('getById', () => {
  async function getById(repo: PostgresUserRepository, userId: string) {
    return await repo.getById(userId);
  }

  test("returns null if the user can't be found", async () => {
    const repo = createRepository();

    const user = await getById(repo, 'userId1');

    expect(user).toBeNull();
  });

  test('returns user', async () => {
    const repo = createRepository();
    const savedUser = await saveUser({
      id: 'userId1',
      username: 'Username',
      displayName: 'displayName',
      profilePic: 'profilePic',
    });

    const user = await getById(repo, 'userId1');

    expect(user).toStrictEqual(buildUser(savedUser));
  });

  test('throws if an unexpected error occurs', async () => {
    const repo = createRepository({} as PrismaClient);
    await saveUser({
      id: 'userId1',
      username: 'Username',
      displayName: 'displayName',
      profilePic: 'profilePic',
    });

    await expect(async () => {
      await getById(repo, 'userId1');
    }).rejects.toThrow();
  });
});

describe('getByUsername', () => {
  async function getByUsername(repo: PostgresUserRepository, username: string) {
    return await repo.getByUsername(new Username(username));
  }

  test("returns null if the user can't be found", async () => {
    const repo = createRepository();

    const user = await getByUsername(repo, 'username');

    expect(user).toBeNull();
  });

  test('returns user with the correct username', async () => {
    const repo = createRepository();
    const savedUser1 = await saveUser({
      id: 'userId1',
      username: 'username1',
      displayName: 'displayName',
      profilePic: 'profilePic',
    });
    await saveUser({
      id: 'userId2',
      username: 'username2',
      displayName: 'displayName',
      profilePic: 'profilePic',
    });

    const user = await getByUsername(repo, savedUser1.username);

    expect(user).toStrictEqual(buildUser(savedUser1));
  });

  test('throws if an unexpected error occurs', async () => {
    const repo = createRepository({} as PrismaClient);
    const savedUser = await saveUser({
      id: 'userId1',
      username: 'Username',
      displayName: 'displayName',
      profilePic: 'profilePic',
    });

    await expect(async () => {
      await getByUsername(repo, savedUser.username);
    }).rejects.toThrow();
  });
});
