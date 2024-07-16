import { Prospect } from './Prospect';

export abstract class ProspectRepository {
  abstract getAllBySubstitutionId(substitutionId: string): Promise<Prospect[]>;
}
