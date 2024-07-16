export abstract class ILogger {
  abstract info(message: string, context?: object): void;
  abstract error(message: string, context?: object): void;
  abstract warn(message: string, context?: object): void;
  abstract debug(message: string, context?: object): void;
}
