import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { HttpModule } from '@nestjs/axios';

// Modules
import { ConfigModule } from '../config/config.module';
import { SharedModule } from '../shared/shared.module';

// Application
import { ProvidersApplication } from './application';

// Infrastructure
import { ChatEntity } from './infrastructure/persistence/entities/Chat.entity';
import { ProspectEntity } from './infrastructure/persistence/entities/Prospect.entity';
import { SubstitutionEntity } from './infrastructure/persistence/entities/Substitution.entity';

import {
  ControllerInfrastructure,
  ProvidersInfrastructure,
  ProvidersListener,
} from './infrastructure';

@Module({
  imports: [
    HttpModule,
    SharedModule,
    ConfigModule,
    TypeOrmModule.forFeature([ChatEntity, ProspectEntity, SubstitutionEntity]),
  ],
  controllers: [...ControllerInfrastructure],
  providers: [
    ...ProvidersInfrastructure,
    ...ProvidersApplication,
    ...ProvidersListener,
  ],
})
export class ChatModule {}
