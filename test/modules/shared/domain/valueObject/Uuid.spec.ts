import validate from 'uuid-validate';
import { v4 as uuid } from 'uuid';

// Domain
import { Uuid } from '../../../../../src/modules/shared/domain/valueObject/Uuid';
import { InvalidArgumentError } from '../../../../../src/modules/shared/domain/exception';

describe('Uuid', () => {
  it('should create a valid UUID object', () => {
    const id = uuid();
    const uuidObject = new Uuid(id);
    expect(uuidObject.value).toBe(id);
  });

  it('should throw an error for an invalid UUID', () => {
    expect(() => new Uuid('invalid-uuid')).toThrow(InvalidArgumentError);
  });

  it('should create a random UUID object', () => {
    const uuidObject = Uuid.random();
    expect(validate(uuidObject.value)).toBe(true);
  });
});
