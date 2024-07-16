import { Module } from '@nestjs/common';
import { TypeOrmModule, TypeOrmModuleAsyncOptions } from '@nestjs/typeorm';
import { DataSource } from 'typeorm';
import * as process from 'process';

// Configuration
import { ConfigModule } from '../../../config/config.module';
import { ConfigEnvService } from '../../../config/ConfigEnvService';
import { factoryConfigurationDatabase } from './FactoryDatabase';

@Module({
  imports: [
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigEnvService],
      useFactory: (configService: ConfigEnvService) => {
        const isTesting = process.env.NODE_ENV === 'test';
        return factoryConfigurationDatabase(isTesting, configService);
      },
      dataSourceFactory: async (options) => {
        try {
          return await new DataSource(options).initialize();
        } catch (error) {
          console.error(error);
        }
      },
    } as TypeOrmModuleAsyncOptions),
  ],
})
export class AzureDatabaseModule {}
