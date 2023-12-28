import { Post } from '../../src/core/entities/post';
import { DefaultGateKeeper } from '../../src/defaultGateKeeper';

export const sampleUserToken = 'userToken';
export const samplePostId = 'postId1';
const samplePost = new Post();
samplePost.setId(samplePostId);
samplePost.setText('sample text');
samplePost.setUserId(DefaultGateKeeper.defaultUser.getId());
export { samplePost };
