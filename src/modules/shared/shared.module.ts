import { Module, OnApplicationBootstrap, OnModuleInit } from '@nestjs/common';
import { HttpModule } from '@nestjs/axios';
import { DiscoveryModule, Reflector } from '@nestjs/core';

// Modules
import { ConfigModule } from '../config/config.module';

// Infrastructure
import { ProvidersInfrastructure } from './infrastructure';
import { SubscriberService } from './infrastructure/events/SubscriberService';
import * as console from 'node:console';

@Module({
  imports: [ConfigModule, HttpModule, DiscoveryModule],
  providers: [...ProvidersInfrastructure, SubscriberService, Reflector],
  exports: [...ProvidersInfrastructure],
})
export class SharedModule implements OnApplicationBootstrap {
  constructor(private readonly subscriberService: SubscriberService) {}

  onApplicationBootstrap(): any {
    const subscribers = this.subscriberService.getSubscribers();
    console.log('Subscribers:', subscribers);
  }
}
