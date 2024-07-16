import { Module } from '@nestjs/common';
import { HttpModule } from '@nestjs/axios';
import { TypeOrmModule } from '@nestjs/typeorm';

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
import { PhoneCallEntity } from './infrastructure/persistence/entities/PhoneCall.entity';

@Module({
  imports: [
    SharedModule,
    ConfigModule,
    HttpModule,
    TypeOrmModule.forFeature([PhoneCallEntity]),
  ],
  controllers: [...ControllerInfrastructure],
  providers: [...ProvidersInfrastructure, ...ProvidersApplication],
})
export class PhoneCallModule {}
