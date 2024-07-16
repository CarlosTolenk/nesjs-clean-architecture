import {
  Customer,
  CustomerWithName,
} from '../../../../../src/modules/shared/domain/valueObject/Customer';
import { InvalidArgumentError } from '../../../../../src/modules/shared/domain/exception';
import { FirstName } from '../../../../../src/modules/shared/domain/valueObject/FirstName';
import { Cellphone } from '../../../../../src/modules/shared/domain/valueObject/Cellphone';
import { CustomerId } from '../../../../../src/modules/shared/domain/valueObject/CustomerId';

describe('Customer', () => {
  describe('constructor', () => {
    it('should create a new Customer instance', () => {
      const cellphone = '56952158950';
      const customerId = 'customerId';

      const customer = new Customer(cellphone, customerId);

      expect(customer.cellphone).toBeInstanceOf(Cellphone);
      expect(customer.cellphone.value).toBe(cellphone);
      expect(customer.customerId).toBeInstanceOf(CustomerId);
      expect(customer.customerId.value).toBe(customerId);
    });

    it('should throw an error if cellphone is not provided', () => {
      expect(() => new Customer('', 'customerId')).toThrow(InvalidArgumentError);
    });

    it('should throw an error if cellphone is invalid', () => {
      expect(() => new Customer('25', 'customerId')).toThrow(
        InvalidArgumentError,
      );
    });

    it('should throw an error if cellphone is invalid without prefix correct', () => {
      expect(() => new Customer('55952158950', 'customerId')).toThrow(
        InvalidArgumentError,
      );
    });

    it('should throw an error if customerId is invalid', () => {
      expect(() => new Customer('56952158950', '')).toThrow(
        InvalidArgumentError,
      );
    });
  });
});
