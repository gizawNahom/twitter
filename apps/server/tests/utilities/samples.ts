import { Post } from '../../src/core/entities/post';

export const sampleUserToken = 'userToken';
export const samplePostId = 'postId1';
export const sampleUserId = 'userId1';
const samplePost = new Post();
samplePost.setId(samplePostId);
samplePost.setText('sample text');
samplePost.setUserId(sampleUserId);
export { samplePost };
