import {
  ApolloQueryResult,
  FetchMoreQueryOptions,
  LazyQueryExecFunction,
  OperationVariables,
  useLazyQuery,
} from '@apollo/client';
import { Chat } from '../core/domain/chat';
import { GET_CHATS } from '../adapters/api/getChats';
import { Client } from '../../../utilities/client';

interface GetChatsVariables {
  offset: number;
  limit: number;
}

interface GetChatsData {
  chats: Chat[];
}

type UpdateQueryFunction = (
  previousQueryResult: GetChatsData,
  options: {
    fetchMoreResult: GetChatsData;
    variables: GetChatsVariables;
  }
) => GetChatsData;

type FetchMoreFunction = (
  fetchMoreOptions: FetchMoreQueryOptions<GetChatsVariables, GetChatsData> & {
    updateQuery?: UpdateQueryFunction;
  }
) => Promise<ApolloQueryResult<GetChatsData>>;

export class ApolloChatsGetter {
  constructor(
    private queryFunction: LazyQueryExecFunction<
      GetChatsData,
      OperationVariables
    >,
    private fetchMoreFunction: FetchMoreFunction,
    private readonly limit: number
  ) {}

  async getChats(): Promise<Chat[] | undefined> {
    const currentChats = this.readChatsCache();
    const variables = this.buildVariables(this.calculateOffset(currentChats));
    if (this.isFirstRequest(currentChats))
      return await this.callQueryFunction(variables);
    else return await this.callFetchMoreFunction(variables);
  }

  private readChatsCache() {
    return Client.client.readQuery({
      query: GET_CHATS,
      variables: { offset: 0, limit: this.limit },
    })?.chats;
  }

  private calculateOffset(currentChats: Chat[]) {
    let offset: number;
    if (!currentChats) offset = 0;
    else {
      offset = currentChats.length / this.limit;
    }
    return offset;
  }

  private buildVariables(offset: number) {
    return {
      offset,
      limit: this.limit,
    };
  }

  private isFirstRequest(currentChats: Chat[]) {
    return !currentChats;
  }

  private async callQueryFunction(variables: {
    offset: number;
    limit: number;
  }): Promise<Chat[] | undefined> {
    return (
      await this.queryFunction({
        variables,
      })
    ).data?.chats;
  }

  private async callFetchMoreFunction(variables: {
    offset: number;
    limit: number;
  }): Promise<Chat[] | undefined> {
    return (
      await this.fetchMoreFunction({
        variables,
        updateQuery(previousQueryResult, { fetchMoreResult }) {
          if (!fetchMoreResult) return previousQueryResult;
          return {
            chats: [...previousQueryResult.chats, ...fetchMoreResult.chats],
          };
        },
      })
    ).data.chats;
  }
}

export function useApolloGetChats(onError: (error: Error) => void) {
  const [getChats, { data: chats, loading, fetchMore }] =
    useLazyQuery<GetChatsData>(GET_CHATS, {
      client: Client.client,
      onError(error) {
        onError(error);
      },
    });

  return { getChats, chats, loading, fetchMore };
}
