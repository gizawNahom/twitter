import { checkUserAuthorization } from '../domainServices';
import { ValidationError } from '../errors';
import { GateKeeper } from '../ports/gateKeeper';
import { Logger } from '../ports/logger';
import { PostIndexGateway } from '../ports/postIndexGateway';
import { ValidationMessages } from '../validationMessages';
import { Limit } from '../valueObjects/limit';
import { Offset } from '../valueObjects/offset';
import { Token } from '../valueObjects/token';
import DOMPurify from 'isomorphic-dompurify';

export class SearchPostsUseCase {
  constructor(
    private gateKeeper: GateKeeper,
    private postIndexGateway: PostIndexGateway,
    private logger: Logger
  ) {}

  async execute(request: SearchPostsRequest) {
    const token = new Token(request.token);
    const limit = new Limit(request.limit);
    const offset = new Offset(request.offset);
    this.validateQuery(request.query);

    await this.makeSureUserIsAuthenticated(token);

    await this.postIndexGateway.query({
      text: this.sanitize(request.query),
      limit: limit.getLimit(),
      offset: offset.getOffset(),
    });
  }

  private async makeSureUserIsAuthenticated(token: Token) {
    await checkUserAuthorization(
      this.gateKeeper,
      this.logger,
      token.getToken()
    );
  }

  private sanitize(query: string) {
    return DOMPurify.sanitize(query).replace(/[{}]/g, '');
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

  private isQueryInvalid(query: string) {
    return query.length === 0 || query.length > 50;
  }

  private throwInvalidQueryError() {
    throw new ValidationError('Query is invalid');
  }
}

export interface SearchPostsRequest {
  token: string;
  query: string;
  limit: number;
  offset: number;
}
