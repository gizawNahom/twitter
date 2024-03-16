import Context from '../../src/context';
import { DefaultGateKeeper } from '../../src/defaultGateKeeper';
import { LoggerSpy } from '../doubles/loggerSpy';
import { PostIndexGatewayErrorStub } from '../doubles/postIndexGatewayErrorStub';
import { PostIndexGatewaySpy } from '../doubles/postIndexGatewaySpy';
import { assertPostResponseMatchesPostEntity } from '../utilities/assertions';
import { sendRequest } from '../utilities/helpers';
import { sampleLimit, sampleOffset } from '../utilities/samples';
import {
  handlesExpectedErrorTest,
  handlesUnexpectedErrorTest,
} from '../utilities/tests';

async function sendSearchPostsRequest(limit = sampleLimit) {
  const query = `query SearchPosts($query: String!, $limit: Int, $offset: Int) {
    searchPosts(query: $query, limit: $limit, offset: $offset) {
      id
      text
      userId
      createdAt
    }
  }`;
  const sampleQueryText = 'query';
  const variables = {
    query: sampleQueryText,
    limit: limit,
    offset: sampleOffset,
  };
  const res = await sendRequest(query, variables);
  return res;
}

afterEach(() => (Context.gateKeeper = new DefaultGateKeeper()));

test('searches posts', async () => {
  Context.postIndexGateway = new PostIndexGatewaySpy();

  const res = await sendSearchPostsRequest();

  expect(res.status).toBe(200);
  expect(res.body.data.searchPosts).toHaveLength(1);
  assertPostResponseMatchesPostEntity(
    res.body.data.searchPosts[0],
    PostIndexGatewaySpy.queryResponse[0]
  );
});

handlesExpectedErrorTest(async () => await sendSearchPostsRequest());

handlesUnexpectedErrorTest(async () => {
  Context.postIndexGateway = new PostIndexGatewayErrorStub();

  return await sendSearchPostsRequest();
});
