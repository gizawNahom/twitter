import Context from './context';
import { ValidationError } from '../core/errors';
import { mutation } from './post/mutation';
import { query } from './post/query';

const GENERIC_ERROR_MESSAGE = 'Server Error';

const resolvers = {
  Mutation: mutation,
  Query: query,
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
