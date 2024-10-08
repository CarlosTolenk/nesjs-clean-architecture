import { DomainEvent } from './DomainEvent';

export abstract class AggregateRoot<T> {
  private domainEvents: Array<DomainEvent>;

  protected constructor() {
    this.domainEvents = [];
  }

  pullDomainEvents(): Array<DomainEvent> {
    const domainEvents = this.domainEvents.slice();
    this.domainEvents = [];

    return domainEvents;
  }

  record(event: DomainEvent): void {
    this.domainEvents.push(event);
  }

  abstract toPrimitives(): T;
}
