import { Provider } from '@nestjs/common';

// Domain

// Infrastructure
import { EventController } from './http/event.controller';

export const ControllerInfrastructure: Array<any> = [EventController];
export const ProvidersInfrastructure: Provider[] = [];
