import { PayloadMakeCall } from './valueObject/PayloadMakeCall';

export abstract class MakeCallRepository {
  abstract execute(body: PayloadMakeCall): Promise<string>;
}
