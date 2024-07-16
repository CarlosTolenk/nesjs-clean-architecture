import { LoggerWinston } from '../../../../../src/modules/shared/infrastructure/logger/loggerWinston';
import { TrackingMiddleware } from '../../../../../src/modules/shared/infrastructure/middleware/Tracking';
import { Request } from 'express';

const mockRequest = {
  trackingId: 'trackingId',
  shippingGroupId: 'shippingGroupId',
} as unknown as Request;

describe('LoggerWinston', () => {
  let logger: LoggerWinston;

  beforeEach(() => {
    logger = new LoggerWinston();
  });

  it('should create an instance', () => {
    expect(logger).toBeDefined();
  });

  it('should call debug method of winston logger', () => {
    const debugSpy = jest.spyOn(logger.instance, 'debug');
    jest.spyOn(TrackingMiddleware, 'request', 'get').mockReturnValue(null);

    logger.debug('Debug message');
    expect(debugSpy).toHaveBeenCalledWith('Debug message', {
      trackingId: '',
      shippingGroupId: '',
    });
  });

  it('should call error method of winston logger', () => {
    const errorSpy = jest.spyOn(logger.instance, 'error');
    jest.spyOn(TrackingMiddleware, 'request', 'get').mockReturnValue(null);

    logger.error('Error message');
    expect(errorSpy).toHaveBeenCalledWith('Error message', {
      trackingId: '',
      shippingGroupId: '',
    });
  });

  it('should call info method of winston logger', () => {
    const infoSpy = jest.spyOn(logger.instance, 'info');
    jest.spyOn(TrackingMiddleware, 'request', 'get').mockReturnValue(null);

    logger.info('Info message');
    expect(infoSpy).toHaveBeenCalledWith('Info message', {
      trackingId: '',
      shippingGroupId: '',
    });
  });

  it('should call warn method of winston logger', () => {
    const warnSpy = jest.spyOn(logger.instance, 'warn');
    jest.spyOn(TrackingMiddleware, 'request', 'get').mockReturnValue(null);

    logger.warn('Warn message');
    expect(warnSpy).toHaveBeenCalledWith('Warn message', {
      trackingId: '',
      shippingGroupId: '',
    });
  });

  it('should call info method of winston logger with headers', () => {
    const infoSpy = jest.spyOn(logger.instance, 'info');
    jest
      .spyOn(TrackingMiddleware, 'request', 'get')
      .mockReturnValue(mockRequest);

    logger.info('Info message');
    expect(infoSpy).toHaveBeenCalledWith('Info message', {
      trackingId: 'trackingId',
      shippingGroupId: 'shippingGroupId',
    });
  });
});
