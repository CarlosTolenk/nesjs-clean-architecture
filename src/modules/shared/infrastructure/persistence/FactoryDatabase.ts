import { DatabaseType, DataSourceOptions } from 'typeorm';

// Config
import { ConfigEnvService } from '../../../config/ConfigEnvService';

// Infrastructure
import { ChatEntity } from '../../../chat/infrastructure/persistence/entities/Chat.entity';
import { SubstitutionEntity } from '../../../chat/infrastructure/persistence/entities/Substitution.entity';
import { ProspectEntity } from '../../../chat/infrastructure/persistence/entities/Prospect.entity';
import { PhoneCallEntity } from '../../../phoneCall/infrastructure/persistence/entities/PhoneCall.entity';

export function factoryConfigurationDatabase(
  isTesting: boolean,
  configService: ConfigEnvService,
): DataSourceOptions {
  if (isTesting) {
    return {
      type: 'sqljs',
      location: 'example_db',
      entities: [
        ChatEntity,
        SubstitutionEntity,
        ProspectEntity,
        PhoneCallEntity,
      ],
      synchronize: true,
    } as DataSourceOptions;
  }

  const azureDbConnections = configService.getConfig().db;
  return {
    name: azureDbConnections.name,
    type: 'mssql' as DatabaseType,
    host: azureDbConnections.host,
    port: azureDbConnections.port,
    database: azureDbConnections.database,
    connectionTimeout: azureDbConnections.connectionTimeout,
    requestTimeout: azureDbConnections.requestTimeout,
    username: azureDbConnections.username,
    password: azureDbConnections.password,
    entities: [
      'dist/modules/**/infrastructure/persistence/entities/*.entity{.js,.ts}',
    ],
    migrations: [
      'dist/modules/shared/infrastructure/persistence/migrations/*{.js,.ts}',
    ],
    dropSchema: false,
    synchronize: false,
    options: {
      encrypt: true,
      trustServerCertificate: true
    },
    cli: {
      migrationsDir: 'src/modules/shared/infrastructure/persistence/migrations',
    },
    migrationsRun: true,
    migrationsTableName: 'migration',
    retryAttempts: azureDbConnections.retryAttempts,
    retryDelay: azureDbConnections.retryDelay,
    autoLoadEntities: true,
    logging: ['log'],
    pool: {
      max: azureDbConnections.pool.max,
      min: azureDbConnections.pool.min,
      acquireTimeoutMillis: azureDbConnections.pool.acquire,
    },
  } as DataSourceOptions;
}
