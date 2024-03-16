import { Post } from '../../src/core/entities/post';
import { PostIndexGateway } from '../../src/core/ports/postIndexGateway';

export class PostIndexGatewayErrorStub implements PostIndexGateway {
  static readonly ERROR_MESSAGE = 'Unexpected error';

  query(): Promise<Post[]> {
    throw new Error(PostIndexGatewayErrorStub.ERROR_MESSAGE);
  }
}
