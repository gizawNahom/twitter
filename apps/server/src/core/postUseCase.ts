import { GateKeeper } from './gateKeeper';
import { PostRepository } from './postRepository';
import { User } from './user';
import { Post } from './post';
import DOMPurify from 'isomorphic-dompurify';

export class PostUseCase {
  constructor(
    private gateKeeper: GateKeeper,
    private postRepository: PostRepository
  ) {}

  async execute(token: string, text: string): Promise<void> {
    this.validateTextLength(text.length);
    const user = this.extractUser(token);
    if (this.isUserValid(user))
      await this.createNewPost(this.sanitizeText(text), user as User);
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

  private async createNewPost(text: string, user: User) {
    const post = buildPost();
    await this.postRepository.save(post);

    function buildPost() {
      const post = new Post();
      post.setText(text);
      post.setUserId(user.getId());
      return post;
    }
  }

  private throwUserIsNotValidError() {
    throw this.createError('User is not valid');
  }

  private createError(message: string) {
    return new Error(message);
  }
}
