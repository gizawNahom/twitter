import { Post } from '../../src/core/entities/post';
import {
  PostIndexGateway,
  QueryRequest,
} from '../../src/core/ports/postIndexGateway';
import { samplePost } from '../utilities/samples';

export class PostIndexGatewaySpy implements PostIndexGateway {
  queryCalls: QueryRequest[] = [];
  static queryResponse = [PostIndexGatewaySpy.addCreatedAtToPost(samplePost)];

  async query(request: QueryRequest): Promise<Post[]> {
    this.queryCalls.push(request);
    return PostIndexGatewaySpy.queryResponse;
  }

  private static addCreatedAtToPost(post: Post) {
    post.setCreatedAt(new Date(2002, 2, 1));
    return post;
  }
}
