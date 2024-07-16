import { NumberValueObject } from '../../../../../src/modules/shared/domain/valueObject/NumberValueObject';

class ConcreteNumberValueObject extends NumberValueObject {
  constructor(value: number) {
    super(value);
  }
  protected ensureValidValue(value: number): void {
    if (typeof value !== 'number' || isNaN(value)) {
      throw new Error('Invalid value for ConcreteNumberValueObject');
    }
  }
}

describe('NumberValueObject', () => {
  describe('equalsTo', () => {
    it('should return true when comparing equal numbers', () => {
      const obj1 = new ConcreteNumberValueObject(10);
      const obj2 = new ConcreteNumberValueObject(10);
      expect(obj1.equalsTo(obj2)).toBe(true);
    });

    it('should return false when comparing different numbers', () => {
      const obj1 = new ConcreteNumberValueObject(10);
      const obj2 = new ConcreteNumberValueObject(20);
      expect(obj1.equalsTo(obj2)).toBe(false);
    });
  });

  describe('isBiggerThan', () => {
    it('should return true when the value is bigger', () => {
      const obj1 = new ConcreteNumberValueObject(20);
      const obj2 = new ConcreteNumberValueObject(10);
      expect(obj1.isBiggerThan(obj2)).toBe(true);
    });

    it('should return false when the value is smaller', () => {
      const obj1 = new ConcreteNumberValueObject(10);
      const obj2 = new ConcreteNumberValueObject(20);
      expect(obj1.isBiggerThan(obj2)).toBe(false);
    });

    it('should return false when the values are equal', () => {
      const obj1 = new ConcreteNumberValueObject(10);
      const obj2 = new ConcreteNumberValueObject(10);
      expect(obj1.isBiggerThan(obj2)).toBe(false);
    });
  });
});
