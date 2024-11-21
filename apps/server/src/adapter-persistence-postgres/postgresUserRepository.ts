import { PrismaClient } from '@prisma/client';
import { User } from '../core/entities/user';
import { Username } from '../core/entities/username';
import { UserRepository } from '../core/ports/userRepository';

export class PostgresUserRepository implements UserRepository {
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
