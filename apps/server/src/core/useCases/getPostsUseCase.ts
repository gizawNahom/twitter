import { extractUser } from '../domainServices';
import { Post } from '../entities/post';
import { User } from '../entities/user';
import { ValidationError } from '../errors';
import { LogMessages } from '../logMessages';
import { GateKeeper } from '../ports/gateKeeper';
import { Logger } from '../ports/logger';
import { PostRepository } from '../ports/postRepository';
import { UserRepository } from '../ports/userRepository';
import { ValidationMessages } from '../validationMessages';
import { Limit } from '../valueObjects/limit';
import { Offset } from '../valueObjects/offset';
import { Token } from '../valueObjects/token';

export class GetPostsUseCase {
  private readonly UNAUTHENTICATED_LIMIT = 10;
  private readonly UNAUTHENTICATED_OFFSET = 0;

  constructor(
    private gateKeeper: GateKeeper,
    private userRepository: UserRepository,
    private postRepository: PostRepository,
    private logger: Logger
  ) {}

  async execute(request: GetPostsRequest): Promise<GetPostsResponse> {
    new Limit(request.limit);
    new Offset(request.offset);
    this.validateUserId(request.userId);
    await this.ensureUserExists(request.userId);
    return this.buildResponse(await this.getPosts(request));
  }

  private validateUserId(userId: string) {
    if (isEmpty(userId))
      this.throwValidationError(ValidationMessages.USER_ID_REQUIRED);

    function isEmpty(userId: string) {
      return userId.trim().length === 0;
    }
  }

  private async ensureUserExists(userId: string) {
    if (!this.exists(await this.getUser(userId)))
      this.throwValidationError(ValidationMessages.USER_DOES_NOT_EXIST);
  }

  private exists(user: User) {
    if (user !== null) {
      this.logInfo(LogMessages.FETCHED_USER_WITH_ID, { id: user.getId() });
      return true;
    }
    return false;
  }

  private async getUser(userId: string) {
    return await this.userRepository.getById(userId);
  }

  private throwValidationError(message: string) {
    throw new ValidationError(message);
  }

  private async getPosts({ token, userId, limit, offset }: GetPostsRequest) {
    const user = await this.extractUser(new Token(token));
    if (this.isAuthenticated(user)) {
      return await this.getLatestPosts(userId, limit, offset);
    } else
      return await this.getLatestPosts(
        userId,
        this.UNAUTHENTICATED_LIMIT,
        this.UNAUTHENTICATED_OFFSET
      );
  }

  private async extractUser(token: Token) {
    return await extractUser(this.gateKeeper, this.logger, token);
  }

  private isAuthenticated(user: User) {
    return user != null;
  }

  private async getLatestPosts(
    userId: string,
    limit: number,
    offset: number
  ): Promise<Post[]> {
    const posts = await this.postRepository.getLatestPosts(
      userId,
      limit,
      offset
    );
    this.logInfo(LogMessages.FETCHED_USER_POSTS_USING_ID, {
      userId: userId,
      limit: limit,
      offset: offset,
    });
    return posts;
  }

  private logInfo(logMessage: LogMessages, obj) {
    this.logger.logInfo(logMessage, obj);
  }

  private buildResponse(posts: Post[]): GetPostsResponse {
    return {
      posts: posts,
    };
  }
}

export interface GetPostsRequest {
  token: string;
  userId: string;
  limit: number;
  offset: number;
}

export interface GetPostsResponse {
  posts: Array<Post>;
}
