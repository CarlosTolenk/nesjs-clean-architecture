import { DataTransferObject } from '../../../../shared/domain/DataTransfer';
import { ApiProperty } from '@nestjs/swagger';

export class ResponseSendMessageDto extends DataTransferObject {
  @ApiProperty()
  status: string;

  @ApiProperty()
  message: string;

  private constructor(param: Partial<ResponseSendMessageDto>) {
    super();
    this.status = param.status;
    this.message = param.message;
  }

  static OK(): ResponseSendMessageDto {
    return new ResponseSendMessageDto({
      status: 'OK',
      message: 'Sent',
    });
  }
}
