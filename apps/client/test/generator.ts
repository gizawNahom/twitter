import { faker } from '@faker-js/faker';
import { Chat } from '../lib/messages/core/domain/chat';
import { Message } from '../lib/messages/core/domain/message';

export function buildChat(): Chat {
  return {
    id: faker.string.uuid(),
    createdAtISO: faker.date.recent().toISOString(),
    participant: {
      username: faker.internet.userName(),
      displayName: faker.internet.displayName(),
      profilePic: faker.image.avatarGitHub(),
    },
  };
}

export function buildMessage(): Message {
  return {
    id: faker.string.uuid(),
    senderId: faker.string.uuid(),
    chatId: faker.string.uuid(),
    text: faker.string.sample(10),
    createdAt: faker.date.recent({ days: 10 }).toISOString(),
  };
}
