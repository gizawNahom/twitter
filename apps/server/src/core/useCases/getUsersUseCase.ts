import { getAuthenticatedUserOrThrow } from '../domainServices';
import { User } from '../entities/user';
import { Username } from '../entities/username';
import { GateKeeper } from '../ports/gateKeeper';
import { Logger } from '../ports/logger';
import { UserRepository } from '../ports/userRepository';
import { Limit } from '../valueObjects/limit';
import { Offset } from '../valueObjects/offset';
import { Token } from '../valueObjects/token';

export class GetUsersUseCase {
  constructor(
    private userRepository: UserRepository,
    private gateKeeper: GateKeeper,
    private logger: Logger
  ) {}

  async execute(request: GetUsersRequest): Promise<GetUsersResponse> {
    const { token, username, limit, offset } = this.createValueObjects(request);
    await getAuthenticatedUserOrThrow(token, this.gateKeeper, this.logger);
    const users = await this.getUsers(username, limit, offset);
    return this.buildResponse(users);
  }

  private createValueObjects({
    tokenString,
    limitValue,
    offsetValue,
    usernameString,
  }: GetUsersRequest) {
    const token = new Token(tokenString);
    const limit = new Limit(limitValue);
    const offset = new Offset(offsetValue);
    const username = new Username(usernameString);
    return { token, username, limit, offset };
  }

  private async getUsers(username: Username, limit: Limit, offset: Offset) {
    return await this.userRepository.getUsers(username, limit, offset);
  }

  private buildResponse(users: User[]): GetUsersResponse {
    return {
      users: users.map((u) => {
        return {
          username: u.getUsername(),
          profilePic: u.getProfilePic(),
          displayName: u.getDisplayName(),
        };
      }),
    };
  }
}

export interface GetUsersRequest {
  tokenString: string;
  limitValue: number;
  offsetValue: number;
  usernameString: string;
}

export interface GetUsersResponse {
  users: {
    username: string;
    profilePic: string;
    displayName: string;
  }[];
}
