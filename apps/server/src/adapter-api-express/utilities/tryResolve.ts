import { handleError } from './handleError';

export async function tryResolve(
  resolve: () => Promise<unknown>,
  errorHandler = handleError
) {
  try {
    return await resolve();
  } catch (error) {
    errorHandler(error);
  }
}
