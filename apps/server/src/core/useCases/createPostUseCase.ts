import { GateKeeper } from '../ports/gateKeeper';
import { PostRepository } from '../ports/postRepository';
import { User } from '../entities/user';
import { Post } from '../entities/post';
import { ValidationError } from '../errors';
import { ValidationMessages } from '../validationMessages';
import { Token } from '../valueObjects/token';
import { Logger } from '../ports/logger';
import { LogMessages } from '../logMessages';
import { getUserOrThrow, sanitizeXSSString } from '../domainServices';

export class CreatePostUseCase {
  constructor(
    private logger: Logger,
    private gateKeeper: GateKeeper,
    private postRepository: PostRepository
  ) {}

  async execute(token: string, text: string): Promise<PostUseCaseResponse> {
    this.validateTextLength(text.length);

    const user = await getUserOrThrow(
      new Token(token),
      this.gateKeeper,
      this.logger
    );

    return this.buildResponse(
      await this.getSavedPost(this.sanitizeText(text), user as User)
    );
  }

  private validateTextLength(textLength: number) {
    if (this.isLongerThan280(textLength)) this.throwTextTooLongError();
    if (this.is0(textLength)) this.throwTextTooShortError();
  }

  private isLongerThan280(textLength: number) {
    return textLength > 280;
  }

  private throwTextTooLongError() {
    throw this.createError(ValidationMessages.TEXT_TOO_LONG);
  }

  private is0(textLength: number) {
    return textLength === 0;
  }

  private throwTextTooShortError() {
    throw this.createError("Text can't be empty");
  }

  private sanitizeText(text: string): string {
    return sanitizeXSSString(text);
  }

  private async getSavedPost(text: string, user: User): Promise<Post> {
    const post = buildPost();
    await this.savePost(post);
    this.logInfo(LogMessages.SAVED_POST, { post });
    return post;

    function buildPost() {
      const post = new Post();
      post.setText(text);
      post.setUserId(user.getId());
      return post;
    }
  }

  private logInfo(logMessage: LogMessages, object: object) {
    this.logger.logInfo(logMessage, object);
  }

  private savePost(post: Post) {
    return this.postRepository.save(post);
  }

  private buildResponse(post: Post) {
    const response = new PostUseCaseResponse();
    response.id = post.getId();
    response.text = post.getText();
    response.userId = post.getUserId();
    response.createdAt = post.getCreatedAt().toISOString();
    return response;
  }

  private createError(message: string) {
    return new ValidationError(message);
  }
}

export class PostUseCaseResponse {
  id: string;
  text: string;
  userId: string;
  createdAt: string;
}
