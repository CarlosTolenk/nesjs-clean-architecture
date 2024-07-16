import { InvalidArgumentError } from '../../../../../src/modules/shared/domain/exception';
import { FieldButton } from '../../../../../src/modules/chat/domain/valueObject/FieldButton';

describe('FieldButton', () => {
  describe('constructor', () => {
    it('should create a new FieldButton instance', () => {
      const fieldValue = 'optionButton';

      const field = new FieldButton(fieldValue);

      expect(field).toBeInstanceOf(FieldButton);
      expect(field.value).toBe(fieldValue);
    });

    it('should throw an error if fieldName is not provided', () => {
      expect(() => new FieldButton('')).toThrow(InvalidArgumentError);
    });

    it('should throw an error if fieldName is not valid', () => {
      expect(() => new FieldButton('34')).toThrow(InvalidArgumentError);
    });
  });
});
