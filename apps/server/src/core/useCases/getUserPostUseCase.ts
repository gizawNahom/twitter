import { ValidationError } from '../errors';
import { GateKeeper } from '../ports/gateKeeper';
import { LogMessages } from '../logMessages';
import { Logger } from '../ports/logger';
import { Post } from '../entities/post';
import { PostRepository } from '../ports/postRepository';
import { ValidationMessages } from '../validationMessages';
import { Token } from '../valueObjects/token';
import { makeSureUserIsAuthenticated } from '../domainServices';
import { extractUser } from '../domainServices';

export class GetUserPostUseCase {
  constructor(
    private logger: Logger,
    private gateKeeper: GateKeeper,
    private postRepository: PostRepository
  ) {}

  async execute(
    token: string,
    postId: string | null
  ): Promise<GetUserPostUseCaseResponse> {
    this.validatePostId(postId);

    makeSureUserIsAuthenticated(
      await extractUser(this.gateKeeper, this.logger, new Token(token))
    );

    const post = await this.getSavedPost(postId);
    if (!this.exists(post)) this.throwInvalidPostIdError();

    return this.buildResponse(post);
  }

  private validatePostId(postId: string) {
    if (postId === '' || postId == null) this.throwPostIdRequiredError();
  }

  private throwPostIdRequiredError() {
    this.throwValidationError(ValidationMessages.POST_ID_REQUIRED);
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
    const response = new GetUserPostUseCaseResponse();
    response.id = savedPost.getId();
    response.text = savedPost.getText();
    response.userId = savedPost.getUserId();
    response.createdAt = savedPost.getCreatedAt().toISOString();
    return response;
  }
}

export class GetUserPostUseCaseResponse {
  id: string;
  text: string;
  userId: string;
  createdAt: string;
}
