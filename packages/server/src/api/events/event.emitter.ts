export class EventEmitter<E extends string = string, V = undefined> {
  private readonly handlers: Map<E | '*', ((e: V) => void | Promise<void>)[]> =
    new Map();

  public on(event: E | '*', handler: (e: V) => void | Promise<void>) {
    const eventHandlers = this.handlers.get(event);

    if (!eventHandlers) {
      this.handlers.set(event, [handler]);
      return;
    }

    eventHandlers.push(handler);
  }

  public async emit(event: E, data: V) {
    const eventHandlers = this.handlers.get(event) || [];
    const wildcardHandlers = this.handlers.get('*') || [];

    const handlers = eventHandlers.concat(wildcardHandlers);

    await Promise.all(handlers.map(async (handler) => await handler(data)));
  }
}
