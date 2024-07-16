import { PayloadMessage } from './PayloadMessage';

interface PayloadSubstitutionMessageFromRequest {}

export class PayloadSubstitutionMessage
  implements PayloadMessage<PayloadSubstitutionMessageFromRequest>
{
  fromRequest(): PayloadSubstitutionMessageFromRequest {
    return {};
  }
}
