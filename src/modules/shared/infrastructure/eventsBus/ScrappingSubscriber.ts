import { OnApplicationBootstrap } from '@nestjs/common';
import { ModulesContainer, Reflector } from '@nestjs/core';

// Domain
import { DomainInjectable } from '../../domain/decorators/DomainInjectable';
import { DomainEventSubscriber } from '../../domain/DomainEventSubscriber';
import { DomainEvent } from '../../domain/DomainEvent';
import { DomainEventSubscriberMetadataKey } from '../../domain/decorators/DomainEventSubscriberDecorator';

@DomainInjectable()
export class ScrappingSubscriber implements OnApplicationBootstrap {
  private subscribers: Array<DomainEventSubscriber<DomainEvent>>;

  constructor(
    private readonly reflector: Reflector,
    private readonly modulesContainer: ModulesContainer,
  ) {}

  onApplicationBootstrap(): any {
    this.findClassesImplementingDomainEventSubscriber();
  }

  private findClassesImplementingDomainEventSubscriber() {
    this.subscribers = Array<DomainEventSubscriber<DomainEvent>>();

    for (const module of this.modulesContainer.values()) {
      for (const provider of module.providers.values()) {
        const instance = provider.instance;

        if (!instance) {
          continue;
        }

        const metadata = this.reflector.get(
          DomainEventSubscriberMetadataKey,
          instance.constructor,
        );

        if (metadata) {
          this.subscribers.push(
            instance as unknown as DomainEventSubscriber<DomainEvent>,
          );
        }
      }
    }
  }

  getSubscribers(): Array<DomainEventSubscriber<DomainEvent>> {
    return this.subscribers;
  }
}
