import { Provider } from '@nestjs/common';

// UseCases
import { GetAllPhoneCall } from './useCases/GetAllPhoneCall';
import { MakeCall } from './useCases/MakeCall';

// Services
import { CallService } from './services/CallServices';

// Listener
import { ExampleListener } from './listener/ExampleListener';

export const ProvidersApplication: Provider[] = [
  GetAllPhoneCall,
  MakeCall,
  CallService,
  ExampleListener,
];
