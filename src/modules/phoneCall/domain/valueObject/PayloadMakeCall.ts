import { ChannelType } from '../../../shared/domain/types';
import { EventTypes } from '../../../shared/domain/EventTypes';
import { ShippingGroupId } from '../../../shared/domain/valueObject/ShippingGroupId';
import { SendingDate } from '../../../shared/domain/valueObject/SendingDate';
import { Cellphone } from '../../../shared/domain/valueObject/Cellphone';
import { BaseValueObject } from '../../../shared/domain/valueObject/BaseValueObject';
import { Customer } from '../../../shared/domain/valueObject/Customer';

interface Params {
  shippingGroupId: string;
  customerCellphone: string;
  pickerCellphone: string;
  customerId: string;
}

interface IPrimitives {
  channel: ChannelType;
  event: string;
  shippingGroupId: string;
  sendingDate: string;
  notificationId: string;
  customer: {
    cellphone: string;
    customerId: string;
  };
  from: {
    cellphone: string;
  };
}

export class PayloadMakeCall implements BaseValueObject<IPrimitives> {
  protected channel: ChannelType;
  protected event: EventTypes;
  protected shippingGroupId: ShippingGroupId;
  protected sendingDate: SendingDate;
  protected customer: Customer;
  protected from: {
    cellphone: Cellphone;
  };
  protected notificationId: string;

  constructor({
    shippingGroupId,
    customerCellphone,
    pickerCellphone,
    customerId,
  }: Params) {
    this.channel = 'PICKING';
    this.event = EventTypes.LIDER_CALL_SOD_PICKING_SUBSTITUTION;
    this.shippingGroupId = new ShippingGroupId(shippingGroupId);
    this.sendingDate = new SendingDate();
    this.customer = new Customer(customerCellphone, customerId);
    this.from = {
      cellphone: new Cellphone(pickerCellphone),
    };
  }

  setNotificationId(value: string): void {
    this.notificationId = value;
  }

  toPrimitives(): IPrimitives {
    return {
      channel: this.channel,
      event: this.event,
      shippingGroupId: this.shippingGroupId.value,
      sendingDate: this.sendingDate.value,
      notificationId: this.notificationId,
      customer: {
        cellphone: this.customer.cellphone.value,
        customerId: this.customer.customerId.value,
      },
      from: {
        cellphone: this.from.cellphone.value,
      },
    };
  }
}
