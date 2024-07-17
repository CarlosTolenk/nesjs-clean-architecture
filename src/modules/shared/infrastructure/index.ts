import { Provider } from '@nestjs/common';

// Domain
import { ILogger } from '../domain/Logger';
import { EVENT_BUS } from '../domain/EventBus';

// Infrastructure
import { LoggerWinston } from './logger/loggerWinston';
import { GenerateWithSR } from './http/headers/GenerateWithSR';
import { InMemoryAsyncEventBus } from './eventsBus/InMemoryAsyncEventBus/InMemoryAsyncEventBus';

export const ProvidersInfrastructure: Provider[] = [
  GenerateWithSR,
  {
    provide: ILogger,
    useValue: new LoggerWinston(),
  },
  {
    provide: EVENT_BUS,
    useClass: InMemoryAsyncEventBus,
  },
];
