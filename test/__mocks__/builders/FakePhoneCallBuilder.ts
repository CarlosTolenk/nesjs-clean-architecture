import { v4 as uuidv4 } from 'uuid';

// Infrastructure
import { FakeBuilder } from './types';
import { PhoneCallEntity } from '../../../src/modules/phoneCall/infrastructure/persistence/entities/PhoneCall.entity';

export class FakePhoneCallBuilder implements FakeBuilder<PhoneCallEntity> {
  private shippingGroupId = 'shippingGroupId';
  private answer = 'N/A';
  private duration = 'N/A';

  withShippingGroupId(shippingGroupId: string) {
    this.shippingGroupId = shippingGroupId;
    return this;
  }

  withAnswer(answer: string) {
    this.answer = answer;
    return this;
  }

  withDuration(duration: string) {
    this.duration = duration;
    return this;
  }
  build(): PhoneCallEntity {
    const phoneCallEntity = new PhoneCallEntity();
    phoneCallEntity.id = uuidv4();
    phoneCallEntity.shippingGroupId = this.shippingGroupId;
    phoneCallEntity.answer = this.answer;
    phoneCallEntity.customerPhone = '56952158950';
    phoneCallEntity.pickerPhone = '56952158951';
    phoneCallEntity.customerId = 'customerId';
    phoneCallEntity.notificationId = uuidv4();
    phoneCallEntity.date = new Date().toISOString();
    phoneCallEntity.duration = this.duration;
    return phoneCallEntity;
  }
}
