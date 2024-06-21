import { mutation as postMutation } from './post/mutation';
import { query as postQuery } from './post/query';
import { mutation as messageMutation } from './message/mutation';
import { query as messageQuery } from './message/query';
import { handleError } from './utilities';

const resolvers = {
  Mutation: { ...postMutation, ...messageMutation },
  Query: { ...postQuery, ...messageQuery },
};

export async function tryResolve(resolve: () => Promise<unknown>) {
  try {
    return await resolve();
  } catch (error) {
    handleError(error);
  }
}

export default resolvers;
