import {
  Injectable,
  OnApplicationBootstrap,
  OnModuleInit,
} from '@nestjs/common';
import { ModulesContainer, Reflector } from '@nestjs/core';
import { DomainEventSubscriberMetadataKey } from '../decorators/DomainEventSubscriberDecorator';
import { DomainEventSubscriber } from '../../domain/DomainEventSubscriber';
import { DomainEvent } from '../../domain/DomainEvent';

@Injectable()
export class SubscriberService implements OnApplicationBootstrap {
  private subscribers: Function[] = [];

  constructor(
    private readonly reflector: Reflector,
    private readonly modulesContainer: ModulesContainer,
  ) {}

  private findClassesImplementingDomainEventSubscriber() {
    this.subscribers = [];

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
          this.subscribers.push(instance.constructor);
        }

        console.log('Checking provider:', provider.name);
        console.log('Instance:', instance.constructor.name);
        console.log('Metadata:', metadata);
      }
    }
  }

  getSubscribers(): Function[] {
    return this.subscribers;
  }

  onApplicationBootstrap(): any {
    this.findClassesImplementingDomainEventSubscriber();
  }
}
