import { User } from '../../src/core/entities/user';
import { Username } from '../../src/core/entities/username';
import { UserRepository } from '../../src/core/ports/userRepository';
import { Limit } from '../../src/core/valueObjects/limit';
import { Offset } from '../../src/core/valueObjects/offset';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

function createRepository() {
  return new PostgresUserRepository(prisma);
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

class PostgresUserRepository implements UserRepository {
  constructor(private prismaClient: PrismaClient) {}

  async getById(userId: string): Promise<User | null> {
    try {
      return await this.tryGetById(userId);
    } catch (error) {
      return null;
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

  getUser(username: Username): Promise<User | null> {
    throw new Error('Method not implemented.');
  }

  getUsers(username: Username, limit: Limit, offset: Offset): Promise<User[]> {
    throw new Error('Method not implemented.');
  }
}
