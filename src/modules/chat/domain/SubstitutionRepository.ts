import { Substitution } from './Substitution';

export abstract class SubstitutionRepository {
  abstract getAllByChatId(chatId: string): Promise<Substitution[]>;
}
