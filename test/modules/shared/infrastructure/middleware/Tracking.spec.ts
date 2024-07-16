import { Test, TestingModule } from '@nestjs/testing';
import { Request, Response, NextFunction } from 'express';
import { TrackingMiddleware } from '../../../../../src/modules/shared/infrastructure/middleware/Tracking';

describe('TrackingMiddleware', () => {
  let middleware: TrackingMiddleware;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [TrackingMiddleware],
    }).compile();

    middleware = module.get<TrackingMiddleware>(TrackingMiddleware);
  });

  it('should be defined', () => {
    expect(middleware).toBeDefined();
  });

  it('should set a trackingId on the request', () => {
    const mockRequest = {
      baseUrl: '/',
      trackingId: null,
      headers: {
        shippingGroup: '',
      },
    } as unknown as Request;
    const mockResponse = {} as Response;
    const nextFunction: NextFunction = jest.fn();

    middleware.use(mockRequest, mockResponse, nextFunction);

    expect(mockRequest.trackingId).toBeDefined();
  });

  it('should call next', () => {
    const mockRequest = {
      baseUrl: '/',
      trackingId: null,
      headers: {
        shippingGroup: '',
      },
    } as unknown as Request;
    const mockResponse = {} as Response;
    const nextFunction: NextFunction = jest.fn();

    middleware.use(mockRequest, mockResponse, nextFunction);

    expect(nextFunction).toHaveBeenCalled();
  });

  it('should set the request on the middleware', () => {
    const mockRequest = {
      baseUrl: '/',
      trackingId: null,
      headers: {
        shippingGroup: '',
      },
    } as unknown as Request;
    const mockResponse = {} as Response;
    const nextFunction: NextFunction = jest.fn();

    middleware.use(mockRequest, mockResponse, nextFunction);

    expect(TrackingMiddleware.request).toBe(mockRequest);
  });
});
