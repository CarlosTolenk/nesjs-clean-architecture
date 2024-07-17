import { v4 as uuid } from 'uuid';

// Domain
import { DomainEvent } from '../../src/modules/shared/domain/DomainEvent';
import { AggregateRoot } from '../../src/modules/shared/domain/AggregateRoot';

interface PrimitiveObject {
  name: string;
  id: string;
}

export class DomainEventMock extends DomainEvent {
  name: string;
  id: string;

  constructor(public readonly data: any) {
    super({
      eventName: 'event.domain.example.com',
      aggregateId: uuid(),
      eventId: uuid(),
      occurredOn: new Date(),
    });
    this.name = data.name;
    this.id = data.name;
  }

  toPrimitives(): PrimitiveObject {
    return {
      name: this.name,
      id: this.id,
    };
  }
}

export class AggregateRootMock extends AggregateRoot<PrimitiveObject> {
  private id: string;
  private name: string;

  constructor(id: string, name: string) {
    super();
    this.id = id;
    this.name = name;
  }

  toPrimitives(): PrimitiveObject {
    return {
      name: this.name,
      id: this.id,
    };
  }
}
