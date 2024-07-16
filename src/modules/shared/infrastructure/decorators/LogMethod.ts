// Domain
import { ILogger } from '../../domain/Logger';

import { LoggerWinston } from '../logger/loggerWinston';

export default function LogMethod(logger?: ILogger) {
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
        loggerToUse.info(
          `Trying to ${target.constructor.name}.${propertyName}`,
          { params: args },
        );
        try {
          const result = await originalMethod.apply(this, args);
          const endTime = Date.now();
          const elapsedTime = endTime - startTime;
          loggerToUse.info(
            `Successfully ${target.constructor.name}.${propertyName}`,
            { result: result, elapsedTime },
          );
          resolve(result);
        } catch (error) {
          const endTime = Date.now();
          const elapsedTime = endTime - startTime;
          const { message, stack } = error;
          loggerToUse.error(
            `Error while trying to ${target.constructor.name}.${propertyName}`,
            { error: { message, stack }, elapsedTime },
          );
          reject(error);
        }
      });
    };

    return descriptor;
  };
}
