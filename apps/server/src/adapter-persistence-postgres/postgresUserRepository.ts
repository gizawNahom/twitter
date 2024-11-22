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
      if (this.isNotFoundError(error)) return null;
      throw error;
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
      if (this.isNotFoundError(error)) return null;
      throw error;
    }
  }

  private async tryGetByUsername(username: Username) {
    const userDto = await this.prismaClient.user.findUniqueOrThrow({
      where: {
        username: username.getUsername(),
      },
    });
    return this.buildUser(userDto);
  }

  private buildUser(userDto: UserDTO) {
    return new User(
      userDto.id,
      new Username(userDto.username),
      userDto.displayName,
      userDto.profilePic
    );
  }

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  private isNotFoundError(error: any) {
    return error.code === 'P2025';
  }

  getUsers(): Promise<User[]> {
    throw new Error('Method not implemented.');
  }
}

export type UserDTO = {
  id: string;
  username: string;
  displayName: string;
  profilePic: string;
};
