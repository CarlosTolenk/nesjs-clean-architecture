import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString } from 'class-validator';

// Domain
import { DataTransferObject } from '../../../../shared/domain/DataTransfer';

export class SearchShippingGroupIdDto extends DataTransferObject {
  @IsNotEmpty()
  @IsString()
  @ApiProperty()
  shippingGroupId: string;
}
