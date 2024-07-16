import { Injectable, NestMiddleware } from '@nestjs/common';
import { Request, Response, NextFunction } from 'express';
import crypto from 'crypto';

declare global {
  // eslint-disable-next-line @typescript-eslint/no-namespace
  namespace Express {
    interface Request {
      trackingId?: string;
      shippingGroupId?: string;
    }
  }
}

@Injectable()
export class TrackingMiddleware implements NestMiddleware {
  private static _request: Request | undefined;

  public static get request(): Request | undefined {
    return TrackingMiddleware._request;
  }
  use(request: Request, res: Response, next: NextFunction): void {
    if (request.baseUrl.startsWith('/')) {
      const shippingGroupId = request?.headers['shipping-group'] ?? '';
      const trackingIdNew = crypto.randomBytes(12).toString('hex');
      const trackingId = request?.headers['trackingId'] ?? trackingIdNew;

      request.shippingGroupId = shippingGroupId.toString();
      request.trackingId = trackingId.toString();
      TrackingMiddleware._request = request;
    }
    next();
  }
}
