import { DataTransferObject } from '../../../../shared/domain/DataTransfer';
import { ApiProperty } from '@nestjs/swagger';

export class ResponseChatDetailDto extends DataTransferObject {
  @ApiProperty()
  id: string;

  @ApiProperty()
  shippingGroupId: string;

  @ApiProperty()
  choice: string;

  @ApiProperty()
  customerPhone: string;

  @ApiProperty()
  customerId: string;

  @ApiProperty()
  sendingDate: string;

  @ApiProperty()
  agreeExtraPaid: boolean;
}
