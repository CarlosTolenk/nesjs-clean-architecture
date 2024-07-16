import { StringValueObject } from './StringValueObject';
import { InvalidArgumentError } from '../exception';

const REG_EXPRESSION_CELLPHONE = /^56\d{9}$/;
export class Cellphone extends StringValueObject {
  constructor(value: string) {
    super(value);
  }
  protected ensureValidValue(value: string): void {
    const isCellphoneValid = REG_EXPRESSION_CELLPHONE.test(value);
    if (!isCellphoneValid) {
      throw new InvalidArgumentError(`The Cellphone <${value}> is not valid`);
    }
  }
}
