// Domain
import { ILogger } from '../../domain/Logger';

import { LoggerWinston } from '../logger/loggerWinston';

export default function LogOutgoing(serviceName: string, logger?: ILogger) {
  return function (
    target: any,
    propertyName: string,
    descriptor: PropertyDescriptor,
  ) {
    const originalMethod = descriptor.value;
    const defaultLogger = new LoggerWinston();
    const loggerToUse = logger || defaultLogger;

    descriptor.value = async function (...args: any[]) {
      const startTime = Date.now();
      return new Promise(async (resolve, reject) => {
        loggerToUse.info(`[Outgoing] Trying to request ${serviceName}`, {
          params: args,
          serviceName,
        });
        try {
          const result = await originalMethod.apply(this, args);
          const endTime = Date.now();
          const elapsedTime = endTime - startTime;
          loggerToUse.info(`[Outgoing-Successfully] request ${serviceName}`, {
            result: result,
            serviceName,
            elapsedTime,
          });
          resolve(result);
        } catch (error) {
          const endTime = Date.now();
          const elapsedTime = endTime - startTime;
          const { message, stack } = error;
          loggerToUse.error(
            `[Outgoing-Error] while trying to request ${serviceName}`,
            {
              error: { message, stack },
              elapsedTime,
              serviceName,
            },
          );
          reject(error);
        }
      });
    };

    return descriptor;
  };
}
