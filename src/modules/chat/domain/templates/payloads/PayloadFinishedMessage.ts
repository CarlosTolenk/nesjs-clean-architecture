import { PayloadMessage } from './PayloadMessage';

interface PayloadFinishedMessageFromRequest {}

export class PayloadFinishedMessage
  implements PayloadMessage<PayloadFinishedMessageFromRequest>
{
  fromRequest(): PayloadFinishedMessageFromRequest {
    return {};
  }
}
