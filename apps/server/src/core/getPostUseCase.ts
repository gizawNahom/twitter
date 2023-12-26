import { ValidationError } from './errors';
import { GateKeeper } from './gateKeeper';
import { LogMessages } from './logMessages';
import { Logger } from './logger';
import { Post } from './post';
import { PostRepository } from './postRepository';
import { ValidationMessages } from './validationMessages';

export class GetPostUseCase {
  constructor(
    private logger: Logger,
    private gateKeeper: GateKeeper,
    private postRepository: PostRepository
  ) {}

  async execute(
    token: string,
    postId: string | null
  ): Promise<GetPostUseCaseResponse> {
    this.validateToken(token);
    this.validatePostId(postId);
    await this.checkUserAuthorization(token);
    const post = await this.getSavedPost(postId);
    if (!this.exists(post)) this.throwInvalidPostIdError();
    return this.buildResponse(post);
  }

  private validateToken(token: string) {
    if (!token) this.throwValidationError(ValidationMessages.INVALID_TOKEN);
  }

  private validatePostId(postId: string) {
    if (postId === '' || postId == null) this.throwInvalidPostIdError();
  }

  private async checkUserAuthorization(token: string) {
    if (!this.isUserAuthenticated(await this.getUser(token)))
      this.throwValidationError(ValidationMessages.INVALID_USER);
  }

  private isUserAuthenticated(user) {
    return user != null;
  }

  private async getUser(token: string) {
    const user = await this.gateKeeper.extractUser(token);
    this.logInfo(LogMessages.EXTRACTED_USER);
    return user;
  }

  private async getSavedPost(postId: string): Promise<Post> {
    const post = await this.postRepository.getById(postId);
    this.logInfo(LogMessages.FETCHED_POST_WITH_ID, {
      id: postId,
      post: post,
    });
    return post;
  }

  private logInfo(logMessage: string, object?: object) {
    this.logger.logInfo(logMessage, object);
  }

  private exists(savedPost: Post) {
    return savedPost != null;
  }

  private throwInvalidPostIdError() {
    this.throwValidationError(ValidationMessages.INVALID_POST_ID);
  }

  private throwValidationError(message: string) {
    throw new ValidationError(message);
  }

  private buildResponse(savedPost: Post) {
    const response = new GetPostUseCaseResponse();
    response.id = savedPost.getId();
    response.text = savedPost.getText();
    response.userId = savedPost.getUserId();
    response.createdAt = savedPost.getCreatedAt().toISOString();
    return response;
  }
}

export class GetPostUseCaseResponse {
  id: string;
  text: string;
  userId: string;
  createdAt: string;
}
