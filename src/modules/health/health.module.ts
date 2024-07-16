import { Module } from '@nestjs/common';
import { TerminusModule } from '@nestjs/terminus';

import { HealthController } from './health.controller';
import { HttpModule } from '@nestjs/axios';

// Modules
import { SharedModule } from '../shared/shared.module';

@Module({
  imports: [TerminusModule, HttpModule, SharedModule],
  controllers: [HealthController],
})
export class HealthModule {}
