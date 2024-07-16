import { StringValueObject } from '../../../../../src/modules/shared/domain/valueObject/StringValueObject';
import { InvalidArgumentError } from '../../../../../src/modules/shared/domain/exception';

class StringValueObjectTest extends StringValueObject {
  constructor(value: string) {
    super(value);
  }

  protected ensureValidValue(value: string): void {
    if (!value) {
      throw new InvalidArgumentError(
        `<StringValueObjectTest> does not allow the value empty`,
      );
    }
  }
}

describe('StringValueObject', () => {
  it('should defined', () => {
    const expectedValue = 'hello world';

    const valueObject = new StringValueObjectTest(expectedValue);

    expect(valueObject).toBeDefined();
    expect(valueObject.toString()).toEqual(expectedValue);
  });

  it('should it not defined', () => {
    try {
      new StringValueObjectTest('');
    } catch (error) {
      expect(error).toBeDefined();
      expect(error).toEqual(
        new InvalidArgumentError(
          `<StringValueObjectTest> does not allow the value empty`,
        ),
      );
    }
  });
});
