import { Module } from '@nestjs/common';
import { HttpModule } from '@nestjs/axios';

// Modules
import { ConfigModule } from '../config/config.module';
import { SharedModule } from '../shared/shared.module';

// Application
import { ProvidersApplication } from './application';

// Infrastructure
import {
  ControllerInfrastructure,
  ProvidersInfrastructure,
} from './infrastructure';

@Module({
  imports: [SharedModule, ConfigModule, HttpModule],
  controllers: [...ControllerInfrastructure],
  providers: [...ProvidersInfrastructure, ...ProvidersApplication],
})
export class EventModule {}
