import { Post } from '../../src/core/entities/post';
import {
  PostIndexGateway,
  QueryRequest,
} from '../../src/core/ports/postIndexGateway';
import { samplePost } from '../utilities/samples';

export class PostIndexGatewaySpy implements PostIndexGateway {
  queryCalls: QueryRequest[] = [];
  static queryResponse = [samplePost];

  async query(request: QueryRequest): Promise<Post[]> {
    this.queryCalls.push(request);
    return PostIndexGatewaySpy.queryResponse;
  }
}
