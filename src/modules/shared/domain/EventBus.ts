import { DomainEvent } from './DomainEvent';
import { DomainEventSubscriber } from './DomainEventSubscriber';

export const EVENT_BUS = 'EVENT_BUS';

export interface EventBus {
  publish(events: Array<DomainEvent>): Promise<void>;
  addSubscribers(
    subscribers: Array<DomainEventSubscriber<DomainEvent>>,
  ): Promise<void>;
}
