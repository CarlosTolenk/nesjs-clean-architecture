import { v4 as uuidv4 } from 'uuid';

// Infrastructure
import { FakeBuilder } from './types';
import { SubstitutionEntity } from '../../../src/modules/chat/infrastructure/persistence/entities/Substitution.entity';

export class FakeSubstitutionBuilder
  implements FakeBuilder<SubstitutionEntity>
{
  private chatId: string = '';
  private agree: string = 'N/A';

  withChatId(id: string) {
    this.chatId = id;
    return this;
  }
  withAgree(agree: string) {
    this.agree = agree;
    return this;
  }
  build(): SubstitutionEntity {
    const substitutionEntity = new SubstitutionEntity();
    substitutionEntity.id = uuidv4();
    substitutionEntity.messageId = 'messageId';
    substitutionEntity.agree = this.agree;
    substitutionEntity.descriptionOriginal = 'descriptionOriginal';
    substitutionEntity.skuOriginal = 'skuOriginal';
    substitutionEntity.chatId = this.chatId;
    return substitutionEntity;
  }
}
