import { PrismaClient } from '@prisma/client';
import { User } from '../core/entities/user';
import { Username } from '../core/entities/username';
import { UserRepository } from '../core/ports/userRepository';
import { Limit } from '../core/valueObjects/limit';
import { Offset } from '../core/valueObjects/offset';

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

  async getUsersByUsername(
    username: Username,
    limit: Limit,
    offset: Offset
  ): Promise<User[]> {
    return this.buildUsers(await this.getUserDTOs(limit, offset, username));
  }

  private async getUserDTOs(limit: Limit, offset: Offset, username: Username) {
    const take = limit.getLimit();
    const skip = offset.getOffset() * take;
    return await this.prismaClient.user.findMany({
      take: take,
      skip: skip,
      where: {
        username: {
          contains: username.getUsername(),
        },
      },
    });
  }

  private buildUsers(result: UserDTO[]): User[] | PromiseLike<User[]> {
    return result.map((userDTO) => {
      return this.buildUser(userDTO);
    });
  }
}

export type UserDTO = {
  id: string;
  username: string;
  displayName: string;
  profilePic: string;
};
