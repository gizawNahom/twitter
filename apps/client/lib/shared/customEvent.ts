export type EventHandler<T = unknown> = (param: T) => void;

export abstract class CustomEvent<ResultType, ResultKey> {
  private handlers: Map<ResultKey, EventHandler<ResultType>[]> = new Map();

  add(handler: EventHandler<ResultType>, key: ResultKey) {
    if (!this.handlers.has(key)) {
      this.handlers.set(key, []);
    }
    this.handlers.get(key)?.push(handler);
  }

  remove(handler: EventHandler<ResultType>, key: ResultKey) {
    if (this.handlers.has(key)) {
      const handlersForChat = this.handlers.get(
        key
      ) as EventHandler<ResultType>[];
      this.handlers.set(
        key,
        handlersForChat.filter((h) => h !== handler)
      );
    }
  }

  dispatch(param: ResultType, key: ResultKey) {
    if (this.handlers.has(key)) {
      const handlersForChat = this.handlers.get(key);
      handlersForChat?.forEach((handler) => handler(param));
    }
  }
}
