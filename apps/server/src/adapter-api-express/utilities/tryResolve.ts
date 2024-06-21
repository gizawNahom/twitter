import { handleError } from './handleError';

export async function tryResolve(resolve: () => Promise<unknown>) {
  try {
    return await resolve();
  } catch (error) {
    handleError(error);
  }
}
