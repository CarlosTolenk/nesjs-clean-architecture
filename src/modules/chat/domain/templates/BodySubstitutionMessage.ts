import { EventTypes } from '../../../shared/domain/EventTypes';
import {
  BodyMessage,
  BodyMessagePrimitives,
  IPayloadBody,
} from './BodyMessage';
import { PayloadSubstitutionMessage } from './payloads/PayloadSubstitutionMessage';
import { CustomerWithName } from '../../../shared/domain/valueObject/Customer';
import { SendingDate } from '../../../shared/domain/valueObject/SendingDate';
import { ShippingGroupId } from '../../../shared/domain/valueObject/ShippingGroupId';
export class BodySubstitutionMessage extends BodyMessage<PayloadSubstitutionMessage> {
  protected payload: PayloadSubstitutionMessage;
  constructor(payload: IPayloadBody<PayloadSubstitutionMessage>) {
    super();
    this.channel = 'PICKING';
    this.event =
      EventTypes.WSP_PICKING_SUBSTITUTION_PROSPECT_APPROVAL;
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
