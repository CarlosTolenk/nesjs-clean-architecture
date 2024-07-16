export abstract class NumberValueObject {
  readonly value: number;

  protected constructor(value: number) {
    this.value = value;
    this.ensureValidValue(value);
  }

  equalsTo(other: NumberValueObject): boolean {
    return this.value === other.value;
  }

  isBiggerThan(other: NumberValueObject): boolean {
    return this.value > other.value;
  }

  protected abstract ensureValidValue(value: number): void;
}
