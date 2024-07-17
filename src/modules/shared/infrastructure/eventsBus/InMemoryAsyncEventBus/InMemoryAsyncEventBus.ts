import { EventEmitter } from 'events';

// Domain
import { DomainEvent } from '../../../domain/DomainEvent';
import { EventBus } from '../../../domain/EventBus';
import { DomainEventSubscriber } from '../../../domain/DomainEventSubscriber';
import { DomainInjectable } from '../../../domain/decorators/DomainInjectable';

@DomainInjectable()
export class InMemoryAsyncEventBus extends EventEmitter implements EventBus {
  async publish(events: DomainEvent[]): Promise<void> {
    events.map((event) => this.emit(event.eventName, event));
  }

  async addSubscribers(
    subscribers: Array<DomainEventSubscriber<DomainEvent>>,
  ): Promise<void> {
    try {
      subscribers.forEach((subscriber) => {
        subscriber.subscribedTo().forEach((event) => {
          this.on(event.EVENT_NAME, subscriber.on.bind(subscriber));
        });
      });
    } catch (error) {
      throw error;
    }
  }
}
