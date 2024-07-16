import { InvalidArgumentError } from '../exception';

export abstract class StringValueObject {
  readonly value: string;

  protected constructor(value: string) {
    this.ensureIsFill(value);
    this.ensureValidValue(value);
    this.value = value;
  }

  private ensureIsFill(value: string): void {
    if (!value) {
      throw new InvalidArgumentError(
        `<${this.constructor.name}> does not allow the value empty`,
      );
    }
  }

  protected abstract ensureValidValue(value: string): void;

  toString(): string {
    return this.value;
  }
}
