import { SubstitutionRepository } from '../../src/modules/chat/domain/SubstitutionRepository';
import { Substitution } from '../../src/modules/chat/domain/Substitution';

export class SubstitutionRepositoryMock extends SubstitutionRepository {
  getAllByChatId(chatId: string): Promise<Substitution[]> {
    return Promise.resolve([]);
  }
}
