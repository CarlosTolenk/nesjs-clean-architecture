import { ShippingGroupId } from '../../shared/domain/valueObject/ShippingGroupId';
import { CustomerId } from '../../shared/domain/valueObject/CustomerId';
import { Cellphone } from '../../shared/domain/valueObject/Cellphone';
import { DomainError } from '../../shared/domain/exception/DomainError';

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

export class Chat {
  id: string;
  shippingGroupId: ShippingGroupId;
  choice: ChoiceAvailableType;
  customerPhone: Cellphone;
  customerId: CustomerId;
  sendingDate: string;
  agreeExtraPaid: boolean;
  createdAt: Date;
  updatedAt: Date;

  constructor(params: Partial<Chat>) {
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
      sendingDate: this.sendingDate,
      agreeExtraPaid: this.agreeExtraPaid,
    };
  }
}
