import {
  AggregateRootMock,
  DomainEventMock,
} from '../../../__mocks__/AggregateRootMock';

describe('AggregateRoot', () => {
  let aggregate: AggregateRootMock;

  beforeEach(() => {
    aggregate = new AggregateRootMock('1', 'Test Name');
  });

  it('should record a domain event', () => {
    const event = new DomainEventMock({ key: 'value' });

    aggregate.record(event);
    const events = aggregate.pullDomainEvents();

    expect(events.length).toBe(1);
    expect(events[0]).toBe(event);
  });

  it('should pull domain events and clear the list', () => {
    const event1 = new DomainEventMock({ key: 'value1' });
    const event2 = new DomainEventMock({ key: 'value2' });

    aggregate.record(event1);
    aggregate.record(event2);

    const events = aggregate.pullDomainEvents();

    expect(events.length).toBe(2);
    expect(events).toContain(event1);
    expect(events).toContain(event2);

    // Ensure the domain events are cleared
    const emptyEvents = aggregate.pullDomainEvents();
    expect(emptyEvents.length).toBe(0);
  });

  it('should convert to primitives', () => {
    const primitives = aggregate.toPrimitives();

    expect(primitives).toEqual({ id: '1', name: 'Test Name' });
  });
});
