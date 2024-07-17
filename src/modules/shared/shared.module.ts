import { Module, OnApplicationBootstrap } from '@nestjs/common';
import { HttpModule } from '@nestjs/axios';
import { DiscoveryModule, Reflector } from '@nestjs/core';

// Modules
import { ConfigModule } from '../config/config.module';

// Infrastructure
import { ProvidersInfrastructure } from './infrastructure';
import { ScrappingSubscriber } from './infrastructure/eventsBus/ScrappingSubscriber';

@Module({
  imports: [ConfigModule, HttpModule, DiscoveryModule],
  providers: [...ProvidersInfrastructure, ScrappingSubscriber, Reflector],
  exports: [...ProvidersInfrastructure],
})
export class SharedModule implements OnApplicationBootstrap {
  constructor(private readonly subscriberService: ScrappingSubscriber) {}

  onApplicationBootstrap(): any {
    const subscribers = this.subscriberService.getSubscribers();
    console.log('Subscribers:', subscribers);
  }
}
