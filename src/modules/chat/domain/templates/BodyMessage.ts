import {
  Customer,
  CustomerWithName,
} from '../../../shared/domain/valueObject/Customer';
import { EventTypes } from '../../../shared/domain/EventTypes';
import { PayloadMessage } from './payloads/PayloadMessage';
import { ChannelType } from '../../../shared/domain/types';
import { ShippingGroupId } from '../../../shared/domain/valueObject/ShippingGroupId';
import { SendingDate } from '../../../shared/domain/valueObject/SendingDate';

export interface BodyMessagePrimitives {
  channel: string;
  customer: {
    cellphone: string;
    firstName: string;
  };
  event: string;
  shippingGroupId: string;
  sendingDate: string;
  payload: object;
}

export interface IPayloadBody<P> {
  shippingGroupId: string;
  firstName: string;
  cellphone: string;
  customerId: string;
  payload: P;
}

export abstract class BodyMessage<TPayload extends PayloadMessage<unknown>> {
  protected channel: ChannelType;
  protected event: EventTypes;
  protected shippingGroupId: ShippingGroupId;
  protected sendingDate: SendingDate;
  protected customer: CustomerWithName;

  protected abstract payload: TPayload;
  abstract messagePlain(): BodyMessagePrimitives;
}
