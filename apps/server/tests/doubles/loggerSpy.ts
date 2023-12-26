import { Logger } from '../../src/core/ports/logger';

export class LoggerSpy implements Logger {
  logInfoCalls: unknown[][] = [];
  logInfo(message: string, obj?: object | undefined) {
    this.logInfoCalls.push([message, obj]);
  }
}
