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
  test("returns null if the user can't be found", async () => {
    const repo = createRepository();

    const user = await repo.getById('userId1');

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

    const user = await repo.getById('userId1');

    expect(user).toStrictEqual(
      new User(
        savedUser.id,
        new Username(savedUser.username),
        savedUser.displayName,
        savedUser.profilePic
      )
    );
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
      await repo.getById('userId1');
    }).rejects.toThrow();
  });
});

describe('getByUsername', () => {
  test("returns null if the user can't be found", async () => {
    const repo = createRepository();

    const user = await repo.getByUsername(new Username('username'));

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

    const user = await repo.getByUsername(new Username('username1'));

    expect(user).toStrictEqual(
      new User(
        savedUser1.id,
        new Username(savedUser1.username),
        savedUser1.displayName,
        savedUser1.profilePic
      )
    );
  });
});

class PostgresUserRepository implements UserRepository {
  constructor(private prismaClient: PrismaClient) {}

  async getById(userId: string): Promise<User | null> {
    try {
      return await this.tryGetById(userId);
    } catch (error) {
      if (error.code === 'P2025') return null;
      throw error;
    }
  }

  private async tryGetById(userId: string) {
    const userDto = await this.prismaClient.user.findUniqueOrThrow({
      where: {
        id: userId,
      },
    });
    return new User(
      userDto.id,
      new Username(userDto.username),
      userDto.displayName,
      userDto.profilePic
    );
  }

  async getByUsername(username: Username): Promise<User | null> {
    try {
      const userDto = await this.prismaClient.user.findFirstOrThrow({
        where: {
          username: username.getUsername(),
        },
      });
      return new User(
        userDto.id,
        new Username(userDto.username),
        userDto.displayName,
        userDto.profilePic
      );
    } catch (error) {
      return null;
    }
  }

  getUsers(): Promise<User[]> {
    throw new Error('Method not implemented.');
  }
}
