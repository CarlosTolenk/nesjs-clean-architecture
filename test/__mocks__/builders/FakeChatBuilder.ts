import { v4 as uuidv4 } from 'uuid';

// Domain
import { ChoiceAvailableType } from '../../../src/modules/chat/domain/Chat';

// Infrastructure
import { ChatEntity } from '../../../src/modules/chat/infrastructure/persistence/entities/Chat.entity';
import { FakeBuilder } from './types';

export class FakeChatBuilder implements FakeBuilder<ChatEntity> {
  private shippingGroupId = 'shippingGroupId';
  private choice: ChoiceAvailableType;

  withShippingGroupId(shippingGroupId: string) {
    this.shippingGroupId = shippingGroupId;
    return this;
  }

  withChoice(choice: ChoiceAvailableType) {
    this.choice = choice;
    return this;
  }

  build(): ChatEntity {
    const chatEntity = new ChatEntity();
    chatEntity.id = uuidv4();
    chatEntity.shippingGroupId = this.shippingGroupId;
    chatEntity.customerPhone = '56952158950';
    chatEntity.customerId = 'customerId';
    chatEntity.date = new Date().toISOString();
    chatEntity.choice = this.choice ?? ChoiceAvailableType.UNANSWERED;
    chatEntity.agreeExtraPaid = false;
    return chatEntity;
  }
}
