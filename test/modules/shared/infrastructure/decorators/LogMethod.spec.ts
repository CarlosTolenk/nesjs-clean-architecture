import LogMethod from '../../../../../src/modules/shared/infrastructure/decorators/LogMethod';
import { ILogger } from '../../../../../src/modules/shared/domain/Logger';

describe('LogMethod decorator', () => {
  it('should log method execution', async () => {
    const mockLogger: ILogger = {
      info: jest.fn(),
      error: jest.fn(),
      warn: jest.fn(),
      debug: jest.fn(),
    };

    const decorator = LogMethod(mockLogger);

    const target = {};
    const propertyName = 'someMethod';
    const descriptor = {
      value: async () => {},
    };
    const decoratedMethod = decorator(target, propertyName, descriptor);

    await decoratedMethod.value();

    expect(mockLogger.info).toHaveBeenCalledTimes(2);
  });

  it('should log error', async () => {
    const mockLogger: ILogger = {
      info: jest.fn(),
      error: jest.fn(),
      warn: jest.fn(),
      debug: jest.fn(),
    };

    const decorator = LogMethod(mockLogger);

    const target = {};
    const propertyName = 'someMethod';
    const testError = new Error('Test error');
    const descriptor = {
      value: async () => {
        throw testError;
      },
    };
    const decoratedMethod = decorator(target, propertyName, descriptor);

    await expect(decoratedMethod.value()).rejects.toThrowError('Test error');

    expect(mockLogger.error).toHaveBeenCalledWith(
      'Error while trying to Object.someMethod',
      {
        error: expect.objectContaining({
          message: expect.any(String),
          stack: expect.any(String),
        }),
        elapsedTime: expect.any(Number),
      },
    );
  });
});
