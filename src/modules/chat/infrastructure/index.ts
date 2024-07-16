import { Provider } from '@nestjs/common';

// Domain
import { ProspectRepository } from '../domain/ProspectRepository';
import { ChatRepository } from '../domain/ChatRepository';
import { SubstitutionRepository } from '../domain/SubstitutionRepository';
import { SendMessageRepository } from '../domain/SendMessageRepository';

// Controller
import { ChatController } from './http/chat.controller';

// Infrastructure
import { ChatRepositoryAzure } from './persistence/ChatRepositoryAzure';
import { ProspectRepositoryAzure } from './persistence/ProspectRepositoryAzure';
import { SubstitutionRepositoryAzure } from './persistence/SubstitutionRepositoryAzure';
import { SendMessageRepositoryApi } from './services/SendMessageRepositoryApi';

// Listener
import { ChatUpdatedPreferenceListener } from './listeners/ChatUpdatedPreference/ChatUpdatedPreferenceListener';

export const ControllerInfrastructure: Array<any> = [ChatController];
export const ProvidersInfrastructure: Provider[] = [
  {
    provide: ChatRepository,
    useClass: ChatRepositoryAzure,
  },
  {
    provide: ProspectRepository,
    useClass: ProspectRepositoryAzure,
  },
  {
    provide: SubstitutionRepository,
    useClass: SubstitutionRepositoryAzure,
  },
  {
    provide: SendMessageRepository,
    useClass: SendMessageRepositoryApi,
  },
];

export const ProvidersListener: Provider[] = [ChatUpdatedPreferenceListener];
