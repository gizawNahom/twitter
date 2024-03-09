import { Post } from '../entities/post';

export interface PostIndexGateway {
  query(request: QueryRequest): Promise<Array<Post>>;
}

export interface QueryRequest {
  text: string;
  limit: number;
  offset: number;
}
