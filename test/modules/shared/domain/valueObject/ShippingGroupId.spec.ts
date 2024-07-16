import { ShippingGroupId } from '../../../../../src/modules/shared/domain/valueObject/ShippingGroupId';
import { InvalidArgumentError } from '../../../../../src/modules/shared/domain/exception';

describe('ShippingGroupId', () => {
  it('should create a valid ShippingGroupId', () => {
    const validId = 'valid-id';
    const shippingGroupId = new ShippingGroupId(validId);
    expect(shippingGroupId.value).toBe(validId);
  });

  it('should throw InvalidArgumentError if the value is an empty string', () => {
    const invalidId = '  ';
    expect(() => new ShippingGroupId(invalidId)).toThrow(InvalidArgumentError);
    expect(() => new ShippingGroupId(invalidId)).toThrow(
      `The Channel <${invalidId}> is not valid`,
    );
  });
});
