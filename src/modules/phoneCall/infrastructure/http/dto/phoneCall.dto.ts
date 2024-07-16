import { ApiProperty } from '@nestjs/swagger';

// Domain
import { DataTransferObject } from '../../../../shared/domain/DataTransfer';

export class PhoneCallDto extends DataTransferObject {
  @ApiProperty()
  id: string;

  @ApiProperty()
  shippingGroupId: string;

  @ApiProperty()
  answer: string;

  @ApiProperty()
  customerPhone: string;

  @ApiProperty()
  pickerPhone: string;

  @ApiProperty()
  date: string;

  @ApiProperty()
  duration: string;
}
