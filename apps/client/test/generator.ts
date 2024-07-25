import { faker } from '@faker-js/faker';
import { Chat } from '../lib/messages/core/domain/chat';

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
