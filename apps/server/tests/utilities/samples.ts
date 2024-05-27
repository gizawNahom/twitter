import { Post } from '../../src/core/entities/post';
import { User } from '../../src/core/entities/user';

export const sampleUserToken = 'userToken';

export const samplePostId = 'postId1';

export const sampleUserId = 'userId1';

export const sampleLimit = 1;

export const sampleOffset = 0;

const samplePost = new Post();
samplePost.setId(samplePostId);
samplePost.setText('sample text');
samplePost.setUserId(sampleUserId);
export { samplePost };

const sampleUser1 = new User(sampleUserId);
const sampleUser2 = new User('userId2');
export { sampleUser1, sampleUser2 };

export enum sampleXSS {
  XSSText = '<img src=x onerror=alert("XSS")>',
  sanitizedText = '<img src="x">',
}

export const sampleQueryText = 'query';
