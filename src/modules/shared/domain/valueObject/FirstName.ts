import { StringValueObject } from './StringValueObject';
import { InvalidArgumentError } from '../exception';

const MIN_CHARACTERS_LENGTH = 2;

export class FirstName extends StringValueObject {
  constructor(value: string) {
    super(value);
  }
  protected ensureValidValue(value: string): void {
    if (value.length <= MIN_CHARACTERS_LENGTH) {
      throw new InvalidArgumentError(`The FirstName <${value}> is not valid`);
    }
  }
}
