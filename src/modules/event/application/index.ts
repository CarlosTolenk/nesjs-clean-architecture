import { Provider } from '@nestjs/common';

// UseCases
import { ApplyEventHandler } from './useCases/ApplyEventHandler';

// Services
import { FactoryEventHandler } from './services/FactoryEventHandler';
import { ChoiceEventHandler } from './handlers/ChoiceEventHandler';
export const ProvidersApplication: Provider[] = [
  ApplyEventHandler,
  FactoryEventHandler,
  ChoiceEventHandler,
];
