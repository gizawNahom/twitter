import { ValidationError } from '../../src/core/errors';

export async function assertValidationErrorWithMessage(
  task: () => unknown,
  errorMessage: string
) {
  await expect(task()).rejects.toThrow(errorMessage);
  await expect(task()).rejects.toThrow(ValidationError);
}
