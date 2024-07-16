import { StringValueObject } from '../../../shared/domain/valueObject/StringValueObject';
import { InvalidArgumentError } from '../../../shared/domain/exception';

const MIN_FIELD_LENGTH = 2;
export class FieldButton extends StringValueObject {
  constructor(value: string) {
    super(value);
  }
  protected ensureValidValue(value: string): void {
    if (value.length <= MIN_FIELD_LENGTH) {
      throw new InvalidArgumentError(`The FieldButton <${value}> is not valid`);
    }
  }
}
