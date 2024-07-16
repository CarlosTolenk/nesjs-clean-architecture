import { ProspectRepository } from '../../src/modules/chat/domain/ProspectRepository';
import { Prospect } from '../../src/modules/chat/domain/Prospect';

export class ProspectRepositoryMock extends ProspectRepository {
  getAllBySubstitutionId(substitutionId: string): Promise<Prospect[]> {
    return Promise.resolve([]);
  }
}
