import { Post } from '../../src/core/entities/post';
import { User } from '../../src/core/entities/user';
import { Username } from '../../src/core/entities/username';

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

const sampleUser1 = new User(
  sampleUserId,
  new Username('User1'),
  'displayName',
  'https://sample'
);
const sampleUser2 = new User(
  'userId2',
  new Username('User1'),
  'displayName',
  'https://sample'
);
export { sampleUser1, sampleUser2 };

export enum sampleXSS {
  XSSText = '<img src=x onerror=alert("XSS")>',
  sanitizedText = '<img src="x">',
}

export const sampleQueryText = 'query';

export const emptyString = ' \n\t\r';

export const sampleChatId = 'chatId123';

export const sampleMessage = 'sample message';

export const sampleUsername = 'sampleUserName';
