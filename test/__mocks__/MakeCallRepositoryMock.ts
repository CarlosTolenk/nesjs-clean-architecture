import { MakeCallRepository } from '../../src/modules/phoneCall/domain/MakeCallRepository';
import { PayloadMakeCall } from '../../src/modules/phoneCall/domain/valueObject/PayloadMakeCall';

export class MakeCallRepositoryMock extends MakeCallRepository {
  execute(body: PayloadMakeCall): Promise<string> {
    return Promise.resolve("");
  }
}
