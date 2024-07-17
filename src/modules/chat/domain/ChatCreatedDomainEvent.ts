import { DomainEvent } from '../../shared/domain/DomainEvent';

type CreateChatDomainEventAttributes = {
  readonly customerId: string;
  readonly shippingGroupId: string;
  readonly sendingDate: string;
};

export class ChatCreatedDomainEvent extends DomainEvent {
  static readonly EVENT_NAME = 'chat.created';

  readonly customerId: string;
  readonly shippingGroupId: string;
  readonly sendingDate: string;

  constructor({
    aggregateId,
    customerId,
    shippingGroupId,
    sendingDate,
    eventId,
    occurredOn,
  }: {
    aggregateId: string;
    eventId?: string;
    customerId: string;
    shippingGroupId: string;
    sendingDate: string;
    occurredOn?: Date;
  }) {
    super({
      eventName: ChatCreatedDomainEvent.EVENT_NAME,
      aggregateId,
      eventId,
      occurredOn,
    });
    this.shippingGroupId = shippingGroupId;
    this.sendingDate = sendingDate;
    this.customerId = customerId;
  }

  toPrimitives(): CreateChatDomainEventAttributes {
    const { customerId, shippingGroupId, sendingDate } = this;
    return {
      customerId,
      shippingGroupId,
      sendingDate,
    };
  }

  static fromPrimitives(params: {
    aggregateId: string;
    attributes: CreateChatDomainEventAttributes;
    eventId: string;
    occurredOn: Date;
  }) {
    const { aggregateId, attributes, occurredOn, eventId } = params;
    return new ChatCreatedDomainEvent({
      aggregateId,
      eventId,
      occurredOn,
      customerId: attributes.customerId,
      shippingGroupId: attributes.shippingGroupId,
      sendingDate: attributes.sendingDate,
    });
  }
}
