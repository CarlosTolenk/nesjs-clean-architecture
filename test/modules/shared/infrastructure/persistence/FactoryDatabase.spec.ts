// Config
import { ConfigEnvService } from '../../../../../src/modules/config/ConfigEnvService';

// Infrastructure
import { ChatEntity } from '../../../../../src/modules/chat/infrastructure/persistence/entities/Chat.entity';
import { SubstitutionEntity } from '../../../../../src/modules/chat/infrastructure/persistence/entities/Substitution.entity';
import { ProspectEntity } from '../../../../../src/modules/chat/infrastructure/persistence/entities/Prospect.entity';
import { PhoneCallEntity } from '../../../../../src/modules/phoneCall/infrastructure/persistence/entities/PhoneCall.entity';
import { factoryConfigurationDatabase } from '../../../../../src/modules/shared/infrastructure/persistence/FactoryDatabase';

// Mocks
import { ConfigEnvServiceMock } from '../../../../__mocks__/ConfigEnvServiceMock';

describe('factoryConfigurationDatabase', () => {
  let isTesting: boolean;
  let configService: ConfigEnvService;

  beforeAll(() => {
    configService = new ConfigEnvServiceMock();
  });

  it('should return testing database configuration', () => {
    isTesting = true;

    const result = factoryConfigurationDatabase(isTesting, configService);

    expect(result).toEqual({
      type: 'sqljs',
      location: 'example_db',
      entities: [
        ChatEntity,
        SubstitutionEntity,
        ProspectEntity,
        PhoneCallEntity,
      ],
      synchronize: true,
    });
  });

  it('should return production database configuration', () => {
    isTesting = false;

    const azureDbConnections = configService.getConfig().db;

    const result = factoryConfigurationDatabase(isTesting, configService);

    expect(result).toEqual({
      name: azureDbConnections.name,
      type: 'mssql',
      host: azureDbConnections.host,
      port: azureDbConnections.port,
      database: azureDbConnections.database,
      connectionTimeout: azureDbConnections.connectionTimeout,
      requestTimeout: azureDbConnections.requestTimeout,
      authentication: {
        type: azureDbConnections.authenticationType,
        options: {
          userName: azureDbConnections.username,
          password: azureDbConnections.password,
        },
      },
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
      },
      cli: {
        migrationsDir:
          'src/modules/shared/infrastructure/persistence/migrations',
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
    });
  });
});
