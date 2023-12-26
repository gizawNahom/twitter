import { GateKeeper } from './gateKeeper';
import { PostRepository } from './postRepository';
import { User } from './user';
import { Post } from './post';
import DOMPurify from 'isomorphic-dompurify';
import { ValidationError } from './errors';
import { ValidationMessages } from './validationMessages';

export class PostUseCase {
  constructor(
    private gateKeeper: GateKeeper,
    private postRepository: PostRepository
  ) {}

  async execute(token: string, text: string): Promise<PostUseCaseResponse> {
    this.validateTextLength(text.length);
    const user = await this.extractUser(token);
    if (this.isUserValid(user))
      return this.buildResponse(
        await this.getSavedPost(this.sanitizeText(text), user as User)
      );
    else this.throwUserIsNotValidError();
  }

  private validateTextLength(textLength: number) {
    if (this.isLongerThan280(textLength)) this.throwTextTooLongError();
    if (this.is0(textLength)) this.throwTextTooShortError();
  }

  private isLongerThan280(textLength: number) {
    return textLength > 280;
  }

  private throwTextTooLongError() {
    throw this.createError("Text can't be more than 280 chars");
  }

  private is0(textLength: number) {
    return textLength === 0;
  }

  private throwTextTooShortError() {
    throw this.createError("Text can't be empty");
  }

  private extractUser(token: string) {
    return this.gateKeeper.extractUser(token);
  }

  private isUserValid(user: User | null) {
    return user !== null;
  }

  private sanitizeText(text: string): string {
    return DOMPurify.sanitize(text);
  }

  private async getSavedPost(text: string, user: User): Promise<Post> {
    const post = buildPost();
    await this.savePost(post);
    return post;

    function buildPost() {
      const post = new Post();
      post.setText(text);
      post.setUserId(user.getId());
      return post;
    }
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

  private throwUserIsNotValidError() {
    throw this.createError(ValidationMessages.INVALID_USER);
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
