export const samplePostResponse = {
  id: 'postId1',
  text: 'Hello World',
  userId: 'userId1',
  createdAt: '2023-12-09T04:47:07Z',
  __typename: 'Post',
};

export const sampleOffset = 0;
export const sampleLimit = 10;

export const sampleInvalidOffset = -1;
export const sampleInvalidLimit = -10;

export const sampleQuery = 'hello';

export const searchPostsResponse = [samplePostResponse];

export const sampleUserResponse = {
  username: 'johnDoe',
  displayName: 'Jonny',
  profilePic:
    'https://images.unsplash.com/photo-1457449940276-e8deed18bfff?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8N3x8cHJvZmlsZXxlbnwwfHwwfHx8MA%3D%3D',
  __typename: 'User',
};

export const samplePartialChatResponse = {
  id: 'chatId124',
  createdAt: '2024-07-05T15:11:55.306Z',
  __typename: 'Chat',
};

export const sampleChatResponse = {
  id: samplePartialChatResponse.id,
  createdAtISO: samplePartialChatResponse.createdAt,
  participant: {
    username: sampleUserResponse.username,
    displayName: sampleUserResponse.displayName,
    profilePic: sampleUserResponse.profilePic,
  },
  __typename: 'Chat',
};

export const sampleMessageResponse = {
  id: 'messageId124',
  senderId: 'senderId123',
  chatId: 'chatId124',
  text: 'hello world',
  createdAt: '2024-07-05T15:11:55.306Z',
  __typename: 'Message',
};

export const GENERIC_SERVER_ERROR = 'Generic error';
