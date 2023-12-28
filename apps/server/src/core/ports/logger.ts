export interface Logger {
  logInfo(message: string, obj?: object);
  logError(error: Error);
}
