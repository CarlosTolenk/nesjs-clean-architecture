export class EventBody {
  event: string;
  shippingGroupId: string;
  payload: string;

  constructor(param: Partial<EventBody>) {
    this.event = param.event;
    this.shippingGroupId = param.shippingGroupId;
    this.payload = param.payload;
  }
}
