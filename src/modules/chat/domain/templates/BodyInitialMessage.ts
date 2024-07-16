import {
  BodyMessage,
  BodyMessagePrimitives,
  IPayloadBody,
} from './BodyMessage';
import { PayloadInitialMessage } from './payloads/PayloadInitialMessage';
import { EventTypes } from '../../../shared/domain/EventTypes';
import { CustomerWithName } from '../../../shared/domain/valueObject/Customer';
import { ShippingGroupId } from '../../../shared/domain/valueObject/ShippingGroupId';
import { SendingDate } from '../../../shared/domain/valueObject/SendingDate';

export class BodyInitialMessage extends BodyMessage<PayloadInitialMessage> {
  protected payload: PayloadInitialMessage;
  constructor(payload: IPayloadBody<PayloadInitialMessage>) {
    super();
    this.channel = 'PICKING';
    this.event =
      EventTypes.WSP_PICKING_SUBSTITUTION_PREFERENCES_V1;
    this.shippingGroupId = new ShippingGroupId(payload.shippingGroupId);
    this.sendingDate = new SendingDate();
    this.customer = new CustomerWithName(
      payload.firstName,
      payload.cellphone,
      payload.customerId,
    );
    this.payload = payload.payload;
  }

  messagePlain(): BodyMessagePrimitives {
    return {
      channel: this.channel,
      event: this.event,
      shippingGroupId: this.shippingGroupId.value,
      sendingDate: this.sendingDate.value,
      customer: {
        firstName: this.customer.firstName.value,
        cellphone: this.customer.cellphone.value,
      },
      payload: this.payload.fromRequest(),
    };
  }
}
