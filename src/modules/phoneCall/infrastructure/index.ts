import { Provider } from '@nestjs/common';

// Domain
import { PhoneCallRepository } from '../domain/PhoneCallRepository';
import { MakeCallRepository } from '../domain/MakeCallRepository';

// Infrastructure
import { PhoneCallRepositoryAzure } from './persistence/PhoneCallRepositoryAzure';
import { PhoneCallController } from './http/phoneCall.controller';

// Services
import { MakeCallRepositoryApi } from './service/MakeCallRepositoryApi';

export const ControllerInfrastructure: Array<any> = [PhoneCallController];
export const ProvidersInfrastructure: Provider[] = [
  {
    provide: PhoneCallRepository,
    useClass: PhoneCallRepositoryAzure,
  },
  {
    provide: MakeCallRepository,
    useClass: MakeCallRepositoryApi,
  },
];
