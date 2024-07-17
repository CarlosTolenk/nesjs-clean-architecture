import { ShippingGroupId } from '../../shared/domain/valueObject/ShippingGroupId';
import { CustomerId } from '../../shared/domain/valueObject/CustomerId';
import { Cellphone } from '../../shared/domain/valueObject/Cellphone';
import { AggregateRoot } from '../../shared/domain/AggregateRoot';
import { SendingDate } from '../../shared/domain/valueObject/SendingDate';
import { ChatCreatedDomainEvent } from './ChatCreatedDomainEvent';
import { Uuid } from '../../shared/domain/valueObject/Uuid';

export enum ChoiceAvailableType {
  UNANSWERED = 'UNANSWERED',
  CHOICE_FOR_ME = 'CHOICE_FOR_ME',
  REFUND = 'REFUND',
}

interface ChatPrimitives {
  id: string;
  shippingGroupId: string;
  choice: string;
  customerPhone: string;
  customerId: string;
  sendingDate: string;
  agreeExtraPaid: boolean;
}

export class Chat extends AggregateRoot<ChatPrimitives> {
  id: string;
  shippingGroupId: ShippingGroupId;
  choice: ChoiceAvailableType;
  customerPhone: Cellphone;
  customerId: CustomerId;
  sendingDate: SendingDate;
  agreeExtraPaid: boolean;
  createdAt: Date;
  updatedAt: Date;

  constructor(params: Partial<Chat>) {
    super();
    this.id = params.id;
    this.shippingGroupId = params.shippingGroupId;
    this.choice = params.choice;
    this.customerPhone = params.customerPhone;
    this.customerId = params.customerId;
    this.sendingDate = params.sendingDate;
    this.agreeExtraPaid = params.agreeExtraPaid;
    this.createdAt = params.createdAt;
    this.updatedAt = params.updatedAt;
  }

  static create(params: Partial<Chat>): Chat {
    const chat = new Chat({
      id: Uuid.random().value,
      shippingGroupId: params.shippingGroupId,
      customerPhone: params.customerPhone,
      customerId: params.customerId,
      sendingDate: params.sendingDate,
      agreeExtraPaid: params.agreeExtraPaid,
      choice: params.choice,
    });

    chat.record(
      new ChatCreatedDomainEvent({
        aggregateId: chat.id,
        customerId: chat.customerId.value,
        shippingGroupId: params.shippingGroupId.value,
        sendingDate: params.sendingDate.value,
      }),
    );

    return chat;
  }

  static fromPrimitives(plainData: {
    shippingGroupId: string;
    customer: {
      cellphone: string;
      customerId: string;
    };
    sendingDate: string;
    agreeExtraPaid: boolean;
    choice: ChoiceAvailableType;
  }): Chat {
    return new Chat({
      shippingGroupId: new ShippingGroupId(plainData.shippingGroupId),
      customerPhone: new Cellphone(plainData.customer.cellphone),
      customerId: new CustomerId(plainData.customer.customerId),
      sendingDate: new SendingDate(plainData.sendingDate),
      agreeExtraPaid: plainData.agreeExtraPaid,
      choice: plainData.choice,
    });
  }

  hasAnInitialChat(): boolean {
    return this.choice === ChoiceAvailableType.UNANSWERED;
  }

  toPrimitives(): ChatPrimitives {
    return {
      id: this.id,
      shippingGroupId: this.shippingGroupId.value,
      choice: this.choice,
      customerPhone: this.customerPhone.value,
      customerId: this.customerId.value,
      sendingDate: this.sendingDate.value,
      agreeExtraPaid: this.agreeExtraPaid,
    };
  }
}
