import { PhoneCall } from './PhoneCall';
import { PayloadMakeCall } from './valueObject/PayloadMakeCall';

export abstract class PhoneCallRepository {
  abstract getAllByShippingGroup(shippingGroupId: string): Promise<PhoneCall[]>;
  abstract save(phoneCall: PhoneCall): Promise<void>;
}
