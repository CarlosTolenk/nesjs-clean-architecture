// Domain
import { DataTransferObject } from '../../../../shared/domain/DataTransfer';

export class EventResultDto extends DataTransferObject {
  status: string;

  constructor(value: string) {
    super();
    this.status = value;
  }

  static OK(): EventResultDto {
    return new EventResultDto('OK');
  }
}
