import { User } from '../../src/core/entities/user';
import { Username } from '../../src/core/entities/username';
import { UserRepository } from '../../src/core/ports/userRepository';
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
    const savedUser = await prisma.user.create({
      data: {
        id: 'userId1',
        username: 'Username',
        displayName: 'displayName',
        profilePic: 'profilePic',
      },
    });

    const user = await getById(repo, 'userId1');

    expect(user).toStrictEqual(buildUser(savedUser));
  });

  test('throws if an unexpected error occurs', async () => {
    const repo = createRepository({} as PrismaClient);
    await prisma.user.create({
      data: {
        id: 'userId1',
        username: 'Username',
        displayName: 'displayName',
        profilePic: 'profilePic',
      },
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
    const savedUser1 = await prisma.user.create({
      data: {
        id: 'userId1',
        username: 'username1',
        displayName: 'displayName',
        profilePic: 'profilePic',
      },
    });
    await prisma.user.create({
      data: {
        id: 'userId2',
        username: 'username2',
        displayName: 'displayName',
        profilePic: 'profilePic',
      },
    });

    const user = await getByUsername(repo, savedUser1.username);

    expect(user).toStrictEqual(buildUser(savedUser1));
  });
});

class PostgresUserRepository implements UserRepository {
  constructor(private prismaClient: PrismaClient) {}

  async getById(userId: string): Promise<User | null> {
    try {
      return await this.tryGetById(userId);
    } catch (error) {
      if (isNotFoundError(error)) return null;
      throw error;
    }

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    function isNotFoundError(error: any) {
      return error.code === 'P2025';
    }
  }

  private async tryGetById(userId: string) {
    const userDto = await this.prismaClient.user.findUniqueOrThrow({
      where: {
        id: userId,
      },
    });
    return this.buildUser(userDto);
  }

  async getByUsername(username: Username): Promise<User | null> {
    try {
      return await this.tryGetByUsername(username);
    } catch (error) {
      return null;
    }
  }

  private async tryGetByUsername(username: Username) {
    const userDto = await this.prismaClient.user.findFirstOrThrow({
      where: {
        username: username.getUsername(),
      },
    });
    return this.buildUser(userDto);
  }

  private buildUser(userDto: {
    displayName: string;
    id: string;
    username: string;
    profilePic: string;
  }) {
    return new User(
      userDto.id,
      new Username(userDto.username),
      userDto.displayName,
      userDto.profilePic
    );
  }

  getUsers(): Promise<User[]> {
    throw new Error('Method not implemented.');
  }
}
