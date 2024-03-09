import { Post } from '../../src/core/entities/post';
import {
  PostIndexGateway,
  QueryRequest,
} from '../../src/core/ports/postIndexGateway';

export class PostIndexGatewaySpy implements PostIndexGateway {
  queryCalls: QueryRequest[] = [];

  async query(request: QueryRequest): Promise<Post[]> {
    this.queryCalls.push(request);
    return [];
  }
}
