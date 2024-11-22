import {
  PostgresUserRepository,
  UserDTO,
} from '../../src/adapter-persistence-postgres/postgresUserRepository';
import { User } from '../../src/core/entities/user';
import { Username } from '../../src/core/entities/username';
import { PrismaClient } from '@prisma/client';
import { Limit } from '../../src/core/valueObjects/limit';
import { Offset } from '../../src/core/valueObjects/offset';

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

function buildUser(userDTO: UserDTO): User {
  return new User(
    userDTO.id,
    new Username(userDTO.username),
    userDTO.displayName,
    userDTO.profilePic
  );
}

async function saveUser(userDTO: UserDTO): Promise<UserDTO> {
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
    const savedUser = await saveUser({
      id: 'userId1',
      username: 'Username',
      displayName: 'displayName',
      profilePic: 'profilePic',
    });

    await expect(async () => {
      await getById(repo, savedUser.id);
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

describe('getUsersByUsername', () => {
  async function getUsersByUsername(
    repo: PostgresUserRepository,
    args: { username: string; limit: number; offset: number }
  ) {
    return await repo.getUsersByUsername(
      new Username(args?.username),
      new Limit(args.limit),
      new Offset(args.offset)
    );
  }

  test('returns empty array if no users are saved', async () => {
    const repo = createRepository();

    const users = await getUsersByUsername(repo, {
      username: 'test1',
      limit: 1,
      offset: 0,
    });

    expect(users).toStrictEqual([]);
  });

  test('returns empty array if saved user does not match the username', async () => {
    const repo = createRepository();
    await saveUser(generateUserDTO('Username'));

    const users = await getUsersByUsername(repo, {
      username: 'test1',
      limit: 1,
      offset: 0,
    });

    expect(users).toStrictEqual([]);
  });

  test('works for exact match', async () => {
    const repo = createRepository();
    const user = generateUserDTO('test1');
    await saveUser(user);

    const users = await getUsersByUsername(repo, {
      username: 'test1',
      limit: 1,
      offset: 0,
    });

    expect(users).toStrictEqual([buildUser(user)]);
  });

  test('works for username that contains query', async () => {
    const repo = createRepository();
    const user = generateUserDTO('test11');
    await saveUser(user);

    const users = await getUsersByUsername(repo, {
      username: 'test1',
      limit: 1,
      offset: 0,
    });

    expect(users).toStrictEqual([buildUser(user)]);
  });

  // test('paginates users', async () => {

  // })
});

function generateUserDTO(username: string): UserDTO {
  return {
    id: 'userId1',
    username: username,
    displayName: 'displayName',
    profilePic: 'profilePic',
  };
}
