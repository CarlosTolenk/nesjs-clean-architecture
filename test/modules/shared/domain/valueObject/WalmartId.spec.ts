import {InvalidArgumentError} from '../../../../../src/modules/shared/domain/exception';
import {CustomerId} from '../../../../../src/modules/shared/domain/valueObject/CustomerId';

describe('CustomerId', () => {
    it('should create a valid CustomerId', () => {
        const validId = 'valid-id';
        const customerId = new CustomerId(validId);
        expect(customerId.value).toBe(validId);
    });

    it('should throw InvalidArgumentError if the value is an empty string', () => {
        const invalidId = '  ';
        expect(() => new CustomerId(invalidId)).toThrow(InvalidArgumentError);
        expect(() => new CustomerId(invalidId)).toThrow(
            `The Channel <${invalidId}> is not valid`,
        );
    });
});
