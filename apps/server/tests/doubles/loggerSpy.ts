import { Logger } from '../../src/core/ports/logger';

export class LoggerSpy implements Logger {
  logInfoCalls: unknown[][] = [];
  logErrorWasCalledWith: Error;

  logInfo(message: string, obj?: object | undefined) {
    this.logInfoCalls.push([message, obj]);
  }

  logError(error: Error) {
    this.logErrorWasCalledWith = error;
  }
}
