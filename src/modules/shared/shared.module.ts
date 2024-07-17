import { Inject, Module, OnApplicationBootstrap } from '@nestjs/common';
import { HttpModule } from '@nestjs/axios';
import { DiscoveryModule, Reflector } from '@nestjs/core';

// Modules
import { ConfigModule } from '../config/config.module';

// Domain
import { ILogger } from './domain/Logger';
import { EVENT_BUS, EventBus } from './domain/EventBus';

// Infrastructure
import { ProvidersInfrastructure } from './infrastructure';
import { ScrappingSubscriber } from './infrastructure/eventsBus/ScrappingSubscriber';

@Module({
  imports: [ConfigModule, HttpModule, DiscoveryModule],
  providers: [...ProvidersInfrastructure, ScrappingSubscriber, Reflector],
  exports: [...ProvidersInfrastructure, EVENT_BUS],
})
export class SharedModule implements OnApplicationBootstrap {
  constructor(
    private readonly subscriberService: ScrappingSubscriber,
    private readonly logger: ILogger,
    @Inject(EVENT_BUS) private readonly eventBus: EventBus,
  ) {}

  async onApplicationBootstrap(): Promise<any> {
    try {
      const subscribers = this.subscriberService.getSubscribers();
      await this.eventBus.addSubscribers(subscribers);
      this.logger.info('The Subscriptions all ready');
    } catch (error) {
      this.logger.error(error.message, { ...error });
    }
  }
}
