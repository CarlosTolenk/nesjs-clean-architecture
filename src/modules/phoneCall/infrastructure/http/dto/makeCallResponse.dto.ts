import { ApiProperty } from '@nestjs/swagger';

// Domain
import { DataTransferObject } from '../../../../shared/domain/DataTransfer';

export class MakeCallResponseDto extends DataTransferObject {
  @ApiProperty()
  status: string;

  @ApiProperty()
  message: string;

  @ApiProperty()
  token: string;

  private constructor(param: Partial<MakeCallResponseDto>) {
    super();
    this.status = param.status;
    this.message = param.message;
    this.token = param.token;
  }

  static OK(notificationId: string): MakeCallResponseDto {
    return new MakeCallResponseDto({
      status: 'Ok',
      message: 'Will call you',
      token: notificationId,
    });
  }
}
