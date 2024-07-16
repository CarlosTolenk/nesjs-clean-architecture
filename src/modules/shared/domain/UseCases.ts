import { DataTransferObject } from './DataTransfer';

export interface IUseCases<
  P extends DataTransferObject,
  R extends DataTransferObject,
> {
  execute(params?: P): Promise<R>;
}
