import { Provider } from '@nestjs/common';

// Use Cases
import { GetChatWithSubstitutions } from './useCases/GetChatWithSubstitutions';
import { GetChat } from './useCases/GetChat';
import { SendInitialMessage } from './useCases/SendInitialMessage';
import { SendSubstitutionMessage } from './useCases/SendSubstitutionMessage';
import { SendFinishedMessage } from './useCases/SendFinishedMessage';
import { UpdatePreferenceChoice } from './useCases/UpdatePreferenceChoice';

export const ProvidersApplication: Provider[] = [
  GetChatWithSubstitutions,
  GetChat,
  SendInitialMessage,
  SendSubstitutionMessage,
  SendFinishedMessage,
  UpdatePreferenceChoice,
];
