import { Injectable } from '@nestjs/common';
import { createLogger, format, Logger, transports } from 'winston';

import { ILogger } from '../../domain/Logger';
import { TrackingMiddleware } from '../middleware/Tracking';

@Injectable()
export class LoggerWinston implements ILogger {
  instance: Logger;

  constructor() {
    this.instance = this.getInstanceLogger();
  }
  debug(message: string, context?: object): void {
    const trackingHeaders = this.getTrackingHeaders();
    this.instance.debug(message, { ...context, ...trackingHeaders });
  }

  error(message: string, context?: object): void {
    const trackingHeaders = this.getTrackingHeaders();
    this.instance.error(message, { ...context, ...trackingHeaders });
  }

  info(message: string, context?: object): void {
    const trackingHeaders = this.getTrackingHeaders();
    this.instance.info(message, { ...context, ...trackingHeaders });
  }

  warn(message: string, context?: object): void {
    const trackingHeaders = this.getTrackingHeaders();
    this.instance.warn(message, { ...context, ...trackingHeaders });
  }

  private getTrackingHeaders(): {
    trackingId: string;
    shippingGroupId: string;
  } {
    const request = TrackingMiddleware.request;
    if (!request) {
      return { shippingGroupId: '', trackingId: '' };
    }
    const trackingId = request?.trackingId || '';
    const shippingGroupId = request?.shippingGroupId || '';

    return { trackingId, shippingGroupId };
  }

  private getInstanceLogger() {
    const msgToJSONFormat = format((info) => {
      const { message } = info;

      return { ...info, message };
    });

    const logFormat = {
      simple: format.combine(
        msgToJSONFormat(),
        format.timestamp(),
        format.colorize(),
        format.simple(),
      ),
      json: format.combine(
        msgToJSONFormat(),
        format.timestamp(),
        format.json({ space: 0 }),
      ),
    };

    const isDevelopment = process.env.isDevelopment;
    const logLevel = process.env.logLevel;

    const formatToUse = logFormat[['json', 'simple'][+!!isDevelopment]];

    return createLogger({
      level: logLevel,
      defaultMeta: { logtopic: process.env.LOGTOPIC },
      format: formatToUse,
      transports: [new transports.Console()],
    });
  }
}
