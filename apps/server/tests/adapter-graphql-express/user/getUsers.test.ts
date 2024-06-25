import Context from '../../../src/adapter-api-express/context';
import { UserRepositorySpy } from '../../doubles/userRepositorySpy';
import { sendRequest } from '../../utilities/helpers';
import {
  sampleLimit,
  sampleOffset,
  sampleUser1,
  sampleUsername,
} from '../../utilities/samples';
import {
  testWithExpectedError,
  testWithUnExpectedError,
} from '../../utilities/tests';

let userRepoSpy: UserRepositorySpy;

async function sendGetUsersRequest() {
  const query = `query GetUsers($username: String!, $limit: Int!, $offset: Int!) {
    users(username: $username, limit: $limit, offset: $offset) {
      username
      profilePic
      displayName
    }
  }`;
  const variables = {
    username: sampleUsername,
    limit: sampleLimit,
    offset: sampleOffset,
  };
  const res = await sendRequest(query, variables);
  return res;
}

beforeEach(() => {
  userRepoSpy = new UserRepositorySpy();
  Context.userRepository = userRepoSpy;
});

test('returns correct response', async () => {
  userRepoSpy.getUsersResponse = [sampleUser1];

  const res = await sendGetUsersRequest();

  expect(res.status).toBe(200);
  assertCorrectResponse(res.body.data);

  function assertCorrectResponse(response) {
    expect(response).toStrictEqual({
      users: [
        {
          username: sampleUser1.getUsername(),
          displayName: sampleUser1.getDisplayName(),
          profilePic: sampleUser1.getProfilePic(),
        },
      ],
    });
  }
});

testWithExpectedError(async () => await sendGetUsersRequest());

testWithUnExpectedError(async () => await sendGetUsersRequest());
