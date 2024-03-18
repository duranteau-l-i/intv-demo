import { IEvent } from '../events/Event';

import { Entity } from './Entity';
import { ConcreteMemento, Memento } from './Memento';

export abstract class Aggregate<T = string | number> extends Entity<T> {
  mementos: Memento[] = [];
  version = 0;

  protected backup(data: any) {
    this.mementos.push(new ConcreteMemento(data));
    this.version++;
  }

  protected restore(): any {
    const memento: Memento | undefined = this.mementos.pop();

    if (memento) {
      this.version--;
      return memento?.getState();
    }
  }

  protected showHistory(): void {
    for (const memento of this.mementos) {
      console.log(memento.getState());
    }
  }

  private _domainEvents: IEvent[] = [];

  get domainEvents(): IEvent[] {
    return this._domainEvents;
  }

  protected addDomainEvent(domainEvent: IEvent): void {
    this._domainEvents.push(domainEvent);

    this.logDomainEventAdded(domainEvent);
  }

  public clearEvents(): void {
    this._domainEvents.splice(0, this._domainEvents.length);
  }

  private logDomainEventAdded(domainEvent: IEvent): void {
    const thisClass = Reflect.getPrototypeOf(this);
    const domainEventClass = Reflect.getPrototypeOf(domainEvent);
    console.info(
      `[Domain Event Created]:`,
      thisClass.constructor.name,
      '==>',
      domainEventClass.constructor.name,
    );
  }
}
