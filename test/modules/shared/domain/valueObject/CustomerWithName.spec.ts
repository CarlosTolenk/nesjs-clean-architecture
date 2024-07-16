import { CustomerWithName } from '../../../../../src/modules/shared/domain/valueObject/Customer';
import { InvalidArgumentError } from '../../../../../src/modules/shared/domain/exception';
import { FirstName } from '../../../../../src/modules/shared/domain/valueObject/FirstName';
import { Cellphone } from '../../../../../src/modules/shared/domain/valueObject/Cellphone';
import { CustomerId } from '../../../../../src/modules/shared/domain/valueObject/CustomerId';

describe('CustomerWithName', () => {
  describe('constructor', () => {
    it('should create a new Customer instance', () => {
      const firstName = 'John';
      const cellphone = '56952158950';
      const customerId = 'customerId';

      const customer = new CustomerWithName(firstName, cellphone, customerId);

      expect(customer.firstName).toBeInstanceOf(FirstName);
      expect(customer.firstName.value).toBe(firstName);
      expect(customer.cellphone).toBeInstanceOf(Cellphone);
      expect(customer.cellphone.value).toBe(cellphone);
      expect(customer.customerId).toBeInstanceOf(CustomerId);
      expect(customer.customerId.value).toBe(customerId);
    });

    it('should throw an error if firstName is not provided', () => {
      expect(
        () => new CustomerWithName('', '56952158950', 'customerId'),
      ).toThrow(InvalidArgumentError);
    });

    it('should throw an error if firstName is invalid name', () => {
      expect(
        () => new CustomerWithName('Jo', '56952158950', 'customerId'),
      ).toThrow(InvalidArgumentError);
    });

    it('should throw an error if cellphone is not provided', () => {
      expect(() => new CustomerWithName('John', '', 'customerId')).toThrow(
        InvalidArgumentError,
      );
    });

    it('should throw an error if cellphone is invalid', () => {
      expect(() => new CustomerWithName('John', '25', 'customerId')).toThrow(
        InvalidArgumentError,
      );
    });

    it('should throw an error if customerId is invalid', () => {
      expect(() => new CustomerWithName('John', '25', '')).toThrow(
        InvalidArgumentError,
      );
    });
  });
});
