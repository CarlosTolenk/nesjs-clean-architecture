// Domain
import { DomainEventSubscriber } from '../../../shared/domain/DomainEventSubscriber';

// Infrastructure
import { DomainEventSubscriberDecorator } from '../../../shared/domain/decorators/DomainEventSubscriberDecorator';

@DomainEventSubscriberDecorator()
export class ExampleListener implements DomainEventSubscriber<any> {
  constructor() {}

  on(domainEvent: any): Promise<void> {
    return Promise.resolve(undefined);
  }

  subscribedTo(): Array<any> {
    return undefined;
  }
}
