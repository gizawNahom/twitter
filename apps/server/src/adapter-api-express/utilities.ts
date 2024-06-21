import { ValidationError } from '../core/errors';
import Context from './context';

const GENERIC_ERROR_MESSAGE = 'Server Error';

export function handleError(error: Error, next?: (error: Error) => unknown) {
  Context.logger.logError(error);
  if (isValidationError(error)) throwError(error, next);
  else throwGenericError(next);
}

function isValidationError(error: Error) {
  return error instanceof ValidationError;
}

function throwGenericError(next: (error: Error) => unknown) {
  throwError(new Error(GENERIC_ERROR_MESSAGE), next);
}

function throwError(error: Error, next: (error: Error) => unknown) {
  if (next) next(error);
  else throw error;
}
