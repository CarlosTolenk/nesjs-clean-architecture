import { DataTransferObject } from '../../../../shared/domain/DataTransfer';
import { IsString } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class SendInitialMessageDto extends DataTransferObject {
  @IsString()
  @ApiProperty()
  shippingGroupId: string;

  @IsString()
  @ApiProperty()
  firstName: string;

  @IsString()
  @ApiProperty()
  cellphone: string;

  @IsString()
  @ApiProperty()
  customerId: string;
}
