import { Post } from '../entities/post';
import { User } from '../entities/user';
import { ValidationError } from '../errors';
import { LogMessages } from '../logMessages';
import { GateKeeper } from '../ports/gateKeeper';
import { Logger } from '../ports/logger';
import { PostRepository } from '../ports/postRepository';
import { UserRepository } from '../ports/userRepository';
import { ValidationMessages } from '../validationMessages';
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
    this.validateLimit(request.limit);
    this.validateOffset(request.offset);
    this.validateUserId(request.userId);
    await this.ensureUserExists(request.userId);
    return this.buildResponse(await this.getPosts(request));
  }

  private validateLimit(limit: number) {
    if (limit <= 0 || limit > 20)
      this.throwValidationError(ValidationMessages.INVALID_LIMIT);
  }

  private validateOffset(offset: number) {
    if (offset < 0)
      this.throwValidationError(ValidationMessages.INVALID_OFFSET);
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
    const user = await this.extractUser(token);
    if (this.isAuthenticated(user)) {
      this.logInfo(LogMessages.EXTRACTED_USER, { userId: user.getId() });
      return await this.getLatestPosts(userId, limit, offset);
    } else
      return await this.getLatestPosts(
        userId,
        this.UNAUTHENTICATED_LIMIT,
        this.UNAUTHENTICATED_OFFSET
      );
  }

  private async extractUser(token: string) {
    return await this.gateKeeper.extractUser(new Token(token).getToken());
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