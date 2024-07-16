import { Module } from '@nestjs/common';
import { HttpModule } from '@nestjs/axios';

// Modules
import { ConfigModule } from '../config/config.module';

// Infrastructure
import { ProvidersInfrastructure } from './infrastructure';

@Module({
  imports: [ConfigModule, HttpModule],
  providers: [...ProvidersInfrastructure],
  exports: [...ProvidersInfrastructure],
})
export class SharedModule {}
