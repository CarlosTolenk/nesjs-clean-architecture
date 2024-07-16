import { PhoneCallRepository } from '../../src/modules/phoneCall/domain/PhoneCallRepository';
import { PhoneCall } from '../../src/modules/phoneCall/domain/PhoneCall';

export class PhoneCallRepositoryMock extends PhoneCallRepository {
  getAllByShippingGroup(shippingGroupId: string): Promise<PhoneCall[]> {
    return Promise.resolve([]);
  }

  save(phoneCall: PhoneCall): Promise<void> {
    return Promise.resolve(undefined);
  }
}
