import { StringValueObject } from './StringValueObject';
import { InvalidArgumentError } from '../exception';

export class ShippingGroupId extends StringValueObject {
  constructor(value: string) {
    super(value);
  }
  protected ensureValidValue(value: string): void {
    if (value.trim() === '') {
      throw new InvalidArgumentError(`The Channel <${value}> is not valid`);
    }
  }
}
