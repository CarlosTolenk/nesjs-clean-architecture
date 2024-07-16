import { ConfigEnvService } from '../../src/modules/config/ConfigEnvService';
import { IConfigEnv } from '../../src/modules/config/ConfigInterface';

export class ConfigEnvServiceMock extends ConfigEnvService {
  getConfig(): IConfigEnv {
    return {
      isDevelopment: true,
      profile: 'dev',
      namespace: 'amida',
      hostname: 'localhost',
      port: 3007,
      log: {
        level: 'silly',
      },
      db: {
        host: 'amida-nonprod-5f91a82a.database.windows.net',
        port: 1433,
        username: 'SVCpickinguser_stg@svc.wmtcloud.com',
        database: 'amida-contactability',
        name: 'amida-contactability',
        authenticationType: 'azure-active-directory-password',
        retryAttempts: 10,
        retryDelay: 10,
        connectionTimeout: 10000,
        requestTimeout: 12000,
        pool: {
          max: 5,
          min: 1,
          acquire: 30000,
          idle: 10000,
        },
      },
      apis: {
        hermes: {
          endpoint:
            'https://twilio.com',
          timeout: 3000,
          retryNumber: 2,
          consumerId: '29c4859f-6e04-445e-8273-73da16902006',
          keyVersion: '1',
          name: 'OCTOPUS-HERMES-IPA',
          env: 'stg:1.0.0',
        },
      },
      sendMessage: {
        initialMessage: {
          callOptionButton: 'callOptionButton',
          chooseForMeOptionButton: 'chooseForMeOptionButton',
          refundOptionButton: 'refundOptionButton',
        },
      },
      socket: {
        enable: true,
        endpoint: 'http://localhost',
        pathEndpoint: 'api/config',
        indexKeys: ['pickingContactability'],
        channels: {
          connection: 'CONNECTION',
          connectionError: 'connect_error',
          broadcast: 'ALL_CONFIG_MAP_CLIENT',
        },
      },
    } as IConfigEnv;
  }

  setConfig(key: string, value: any): void {}
}
