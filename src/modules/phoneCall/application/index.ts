import { Provider } from '@nestjs/common';

// UseCases
import { GetAllPhoneCall } from './useCases/GetAllPhoneCall';
import { MakeCall } from './useCases/MakeCall';

// Services
import { CallService } from './services/CallServices';

export const ProvidersApplication: Provider[] = [
  GetAllPhoneCall,
  MakeCall,
  CallService,
];
