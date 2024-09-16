import { AnyTemplate, like } from '@pact-foundation/pact/src/dsl/matchers';
import { Pact } from '@pact-foundation/pact';
import {
  Operations,
  USERNAME_EXISTS_STATE,
  addInteraction,
  createBaseInteraction,
} from '../../testUtilities';
import {
  GENERIC_SERVER_ERROR,
  sampleInvalidLimit,
  sampleInvalidOffset,
  sampleLimit,
  sampleOffset,
  sampleUserResponse,
} from '../../../mocks/values';
import { getUsers } from '../../../utilities/getUsers';

async function sendRequest(username: string, limit: number, offset: number) {
  return await getUsers(username, limit, offset);
}

export function testGetUsers(provider: Pact, baseUrl: URL) {
  describe('Get Users', () => {
    test('gets users', async () => {
      const validOffset = sampleOffset;
      const validLimit = sampleLimit;
      const interaction = createInteraction({
        data: {
          users: [like(sampleUserResponse)],
        },
      })
        .uponReceiving(
          'a request to fetch users with valid username, offset and limit'
        )
        .given(USERNAME_EXISTS_STATE)
        .withVariables({
          username: like(sampleUserResponse.username),
          offset: like(validOffset),
          limit: like(validLimit),
        });
      await addInteraction(provider, interaction);

      const users = await sendRequest(
        sampleUserResponse.username,
        validLimit,
        validOffset
      );

      expect(users).toHaveLength(1);
      expect(users[0]).toStrictEqual(sampleUserResponse);
    });

    test('handles error', async () => {
      const invalidUsername = '';
      const invalidOffset = sampleInvalidOffset;
      const invalidLimit = sampleInvalidLimit;
      const interaction = createInteraction({
        data: {
          users: null,
        },
        errors: [
          {
            message: like(GENERIC_SERVER_ERROR),
          },
        ],
      })
        .uponReceiving(
          'a request to fetch users with invalid id, offset and limit'
        )
        .withVariables({
          username: like(invalidUsername),
          offset: like(invalidOffset),
          limit: like(invalidLimit),
        });
      await addInteraction(provider, interaction);

      await expect(async () => {
        await sendRequest(invalidUsername, invalidLimit, invalidOffset);
      }).rejects.toThrow(new Error());
    });
  });

  function createInteraction(responseBody: AnyTemplate) {
    return createBaseInteraction(baseUrl, responseBody)
      .withOperation(Operations.GetUsers)
      .withQuery(
        `
          query ${Operations.GetUsers}($username: String!, $limit: Int!, $offset: Int!) {
            users(username: $username, limit: $limit, offset: $offset) {
              username
              displayName
              profilePic
              __typename
            }
          }
          `
      );
  }
}
