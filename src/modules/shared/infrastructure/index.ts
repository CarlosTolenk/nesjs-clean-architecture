import { Provider } from '@nestjs/common';

// Domain
import { ILogger } from '../domain/Logger';

// Infrastructure
import { LoggerWinston } from './logger/loggerWinston';
import { GenerateWithSR } from './http/headers/GenerateWithSR';

export const ProvidersInfrastructure: Provider[] = [
  GenerateWithSR,
  {
    provide: ILogger,
    useValue: new LoggerWinston(),
  },
];
