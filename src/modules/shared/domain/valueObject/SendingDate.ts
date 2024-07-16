import { InvalidArgumentError } from '../exception';
import { DateTime } from 'luxon';
DateTime.local().setZone('America/Santiago');

export class SendingDate {
  value: string;
  constructor() {
    this.value = this.getDateInString();
  }

  private getDateInString(): string {
    try {
      return DateTime.local().toSQL();
    } catch (error) {
      throw new InvalidArgumentError(`SendingDate is failing to get the date`);
    }
  }
}
