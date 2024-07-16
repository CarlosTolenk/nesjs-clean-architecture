import { BodyMessage } from './templates/BodyMessage';
import { PayloadMessage } from './templates/payloads/PayloadMessage';

export abstract class SendMessageRepository {
  abstract send<T extends BodyMessage<PayloadMessage<unknown>>>(
    bodyMessage: T,
  ): Promise<void>;
}
