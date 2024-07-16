import { v4 as uuid } from 'uuid';
import validate from 'uuid-validate';
import { InvalidArgumentError } from '../exception';
import { StringValueObject } from './StringValueObject';

export class Uuid extends StringValueObject {
  constructor(value: string) {
    super(value);
    this.ensureValidValue(value);
  }

  static random(): Uuid {
    return new Uuid(uuid());
  }

  protected ensureValidValue(id: string): void {
    if (!validate(id)) {
      throw new InvalidArgumentError(
        `<${this.constructor.name}> does not allow the value <${id}>`,
      );
    }
  }
}
