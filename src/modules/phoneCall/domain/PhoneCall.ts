import { Cellphone } from '../../shared/domain/valueObject/Cellphone';
import { ShippingGroupId } from '../../shared/domain/valueObject/ShippingGroupId';
import { CustomerId } from '../../shared/domain/valueObject/CustomerId';
import { AggregateRoot } from '../../shared/domain/AggregateRoot';

interface IPrimitives {
  id: string;
  shippingGroupId: string;
  answer: string;
  customerPhone: string;
  pickerPhone: string;
  date: string;
  duration: string;
  notificationId: string;
  customerId: string;
}

interface Params {
  id?: string;
  shippingGroupId: string;
  answer?: string;
  customerPhone: string;
  pickerPhone: string;
  date: string;
  duration?: string;
  notificationId: string;
  customerId: string;
}

export class PhoneCall extends AggregateRoot<IPrimitives> {
  private readonly id: string;
  private readonly shippingGroupId: ShippingGroupId;
  private readonly customerId: CustomerId;
  private readonly answer: string;
  private readonly customerPhone: Cellphone;
  private readonly pickerPhone: Cellphone;
  private readonly date: string;
  private readonly duration: string;
  public readonly notificationId: string;

  private constructor(params: {
    date: string;
    duration: string;
    customerPhone: Cellphone;
    answer: string;
    shippingGroupId: ShippingGroupId;
    customerId: CustomerId;
    pickerPhone: Cellphone;
    notificationId: string;
    id: string;
  }) {
    super();
    this.id = params.id;
    this.shippingGroupId = params.shippingGroupId;
    this.customerId = params.customerId;
    this.answer = params.answer;
    this.customerPhone = params.customerPhone;
    this.pickerPhone = params.pickerPhone;
    this.date = params.date;
    this.duration = params.duration;
    this.notificationId = params.notificationId;
  }

  static create(params: Params): PhoneCall {
    return new PhoneCall({
      id: params.id ?? '',
      shippingGroupId: new ShippingGroupId(params.shippingGroupId),
      customerId: new CustomerId(params.customerId),
      answer: params.answer ?? 'N/A',
      customerPhone: new Cellphone(params.customerPhone),
      pickerPhone: new Cellphone(params.pickerPhone),
      date: params.date,
      duration: params.duration ?? '',
      notificationId: params.notificationId,
    });
  }

  toPrimitives(): IPrimitives {
    return {
      id: this.id,
      shippingGroupId: this.shippingGroupId.value,
      answer: this.answer,
      customerPhone: this.customerPhone.value,
      pickerPhone: this.pickerPhone.value,
      date: this.date,
      duration: this.duration,
      notificationId: this.notificationId,
      customerId: this.customerId.value,
    };
  }
}
