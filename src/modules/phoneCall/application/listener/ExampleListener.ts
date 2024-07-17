// Domain
import { DomainEventSubscriber } from '../../../shared/domain/DomainEventSubscriber';
import { DomainEventClass } from '../../../shared/domain/DomainEvent';
import { DomainInjectable } from '../../../shared/domain/decorators/DomainInjectable';
import { ChatCreatedDomainEvent } from '../../../chat/domain/ChatCreatedDomainEvent';
import { DomainEventSubscriberDecorator } from '../../../shared/domain/decorators/DomainEventSubscriberDecorator';

@DomainEventSubscriberDecorator()
@DomainInjectable()
export class ExampleListener
  implements DomainEventSubscriber<ChatCreatedDomainEvent>
{
  constructor() {}

  subscribedTo(): Array<DomainEventClass> {
    return [ChatCreatedDomainEvent];
  }

  on(domainEvent: ChatCreatedDomainEvent): Promise<void> {
    console.log('Escuchando el evento', domainEvent);
    return Promise.resolve(undefined);
  }
}
