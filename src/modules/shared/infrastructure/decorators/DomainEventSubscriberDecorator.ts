import { SetMetadata } from '@nestjs/common';

export const DomainEventSubscriberMetadataKey = 'domain_event_subscriber';

export const DomainEventSubscriberDecorator = (): ClassDecorator => {
  return (target: any) => {
    SetMetadata(DomainEventSubscriberMetadataKey, true)(target);
  };
};
