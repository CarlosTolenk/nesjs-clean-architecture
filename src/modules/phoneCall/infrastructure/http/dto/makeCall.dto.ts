import { ApiProperty } from '@nestjs/swagger';
import { IsString } from 'class-validator';

// Domain
import { DataTransferObject } from '../../../../shared/domain/DataTransfer';

export class MakeCallDto extends DataTransferObject {
  @ApiProperty()
  @IsString()
  shippingGroupId: string;

  @ApiProperty()
  @IsString()
  customerCellphone: string;

  @ApiProperty()
  @IsString()
  pickerCellphone: string;

  @ApiProperty()
  @IsString()
  customerId: string;
}
