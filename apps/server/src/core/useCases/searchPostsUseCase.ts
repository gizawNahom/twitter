import {
  makeSureUserIsAuthenticated,
  sanitizeXSSString,
} from '../domainServices';
import { Post } from '../entities/post';
import { ValidationError } from '../errors';
import { LogMessages } from '../logMessages';
import { GateKeeper } from '../ports/gateKeeper';
import { Logger } from '../ports/logger';
import { PostIndexGateway } from '../ports/postIndexGateway';
import { ValidationMessages } from '../validationMessages';
import { Limit } from '../valueObjects/limit';
import { Offset } from '../valueObjects/offset';
import { Token } from '../valueObjects/token';

export class SearchPostsUseCase {
  constructor(
    private gateKeeper: GateKeeper,
    private postIndexGateway: PostIndexGateway,
    private logger: Logger
  ) {}

  async execute(request: SearchPostsRequest): Promise<SearchPostsResponse> {
    const token = new Token(request.token);
    const limit = new Limit(request.limit);
    const offset = new Offset(request.offset);
    const query = request.query;

    this.validateQuery(query);

    await this.makeSureUserIsAuthenticated(token);

    return this.buildResponse(await this.getPosts(query, limit, offset));
  }

  private validateQuery(query: string) {
    if (isQueryInvalid(query)) throwInvalidQueryError();

    function isQueryInvalid(query: string) {
      return query.length === 0 || query.length > 50;
    }

    function throwInvalidQueryError() {
      throw new ValidationError(ValidationMessages.INVALID_QUERY);
    }
  }

  private async makeSureUserIsAuthenticated(token: Token) {
    await makeSureUserIsAuthenticated(
      this.gateKeeper,
      this.logger,
      token.getToken()
    );
  }

  private async getPosts(query: string, l: Limit, o: Offset) {
    const limit = l.getLimit();
    const offset = o.getOffset();
    const posts = await this.postIndexGateway.query({
      text: this.sanitize(query),
      limit,
      offset,
    });
    this.logger.logInfo(LogMessages.FETCHED_SEARCH_RESULT, {
      query,
      limit,
      offset,
    });
    return posts;
  }

  private sanitize(query: string) {
    return sanitizeXSSString(query).replace(/[{}]/g, '');
  }

  private buildResponse(posts: Post[]): SearchPostsResponse {
    return { posts };
  }
}

export interface SearchPostsRequest {
  token: string;
  query: string;
  limit: number;
  offset: number;
}

export interface SearchPostsResponse {
  posts: Array<Post>;
}
