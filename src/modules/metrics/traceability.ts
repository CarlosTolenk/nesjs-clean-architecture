import crypto from 'crypto';
import { NextFunction, Request, Response } from 'express';

const isInvalidTraceId = (traceId: string) =>
  traceId.toString() === '00000000000000000000000000000000';

const isInvalidParentId = (parentId: string) =>
  parentId.toString() === '0000000000000000';

const setDefaultTraceId = (spanId: string) => spanId.padStart(32, '0');

const setDefaultParentId = (spanId: string) => spanId;

const parseTrackingHeaders = (traceparent?: string) => {
  const spanId = crypto.randomBytes(8).toString('hex');
  const traceparentRegex =
    /^[0-9a-fA-F]{2}-[0-9a-fA-F]{32}-[0-9a-fA-F]{16}-[0-9a-fA-F]{2}/;

  let traceId, parentId;

  if (traceparent && traceparentRegex.test(traceparent)) {
    const splittedTrace = traceparent.split('-');

    traceId = splittedTrace[1];
    parentId = splittedTrace[2];

    traceId = isInvalidTraceId(traceId) ? setDefaultTraceId(spanId) : traceId;
    parentId = isInvalidParentId(parentId)
      ? setDefaultParentId(spanId)
      : parentId;
  }

  return {
    spanId,
    traceId: traceId || setDefaultTraceId(spanId),
    parentId: parentId || setDefaultParentId(spanId),
  };
};

function traceability(req: Request, _res: Response, next: NextFunction) {
  const traceparent = req.headers['traceparent'];

  if (Array.isArray(traceparent))
    throw new Error('Traceparent cannot be an array');

  const trackingTrace = parseTrackingHeaders(traceparent);

  req.headers['spanId'] = trackingTrace.spanId;
  req.headers['traceId'] = trackingTrace.traceId;
  req.headers['parentId'] = trackingTrace.parentId;

  next();
}

export { traceability };
