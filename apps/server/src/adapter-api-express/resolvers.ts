import Context from './context';
import { ValidationError } from '../core/errors';
import { mutation as postMutation } from './post/mutation';
import { query as postQuery } from './post/query';
import { mutation as messageMutation } from './message/mutation';
import { query as messageQuery } from './message/query';

const GENERIC_ERROR_MESSAGE = 'Server Error';

const resolvers = {
  Mutation: { ...postMutation, ...messageMutation },
  Query: { ...postQuery, ...messageQuery },
};

export async function tryResolve(resolve: () => Promise<unknown>) {
  try {
    return await resolve();
  } catch (error) {
    Context.logger.logError(error);
    if (isValidationError(error)) throw error;
    throwGenericError();
  }

  function isValidationError(error: Error) {
    return error instanceof ValidationError;
  }

  function throwGenericError() {
    throw new Error(GENERIC_ERROR_MESSAGE);
  }
}

export default resolvers;
