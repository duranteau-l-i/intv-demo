import { IEvent } from './Event';
import { IEventHandler } from './EventHandler';

export class DomainEvents {
  private static _handlers: Map<string, IEventHandler[]> = new Map();

  static register(handler: IEventHandler) {
    if (this._handlers.has(handler.type)) {
      const h = this._handlers.get(handler.type);
      h.push(handler);
    } else {
      this._handlers.set(handler.type, [handler]);
    }
  }

  static publish(event: IEvent) {
    if (this._handlers.has(event.type)) {
      const handlers = this._handlers.get(event.type);

      handlers.forEach((handler: IEventHandler) => {
        console.debug(
          `\t↪ ${handler.boundedContext}/${handler.constructor.name}`,
        );
        handler.handle(event);
      });
    }
  }
}
