import { DomainEventSubscriberDecorator } from '../../../shared/infrastructure/decorators/DomainEventSubscriberDecorator';
import { Injectable } from '@nestjs/common';
import { DomainEventSubscriber } from '../../../shared/domain/DomainEventSubscriber';

@DomainEventSubscriberDecorator()
@Injectable()
export class ExampleListener implements DomainEventSubscriber<any> {
  constructor() {
    console.log('ExampleListener constructor');
  }

  on(domainEvent: any): Promise<void> {
    return Promise.resolve(undefined);
  }

  subscribedTo(): Array<any> {
    return undefined;
  }
}
