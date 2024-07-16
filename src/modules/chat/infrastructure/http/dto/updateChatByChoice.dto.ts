import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString } from 'class-validator';

// Domain
import { DataTransferObject } from '../../../../shared/domain/DataTransfer';

export class UpdateChatByChoiceDto extends DataTransferObject {
  @IsNotEmpty()
  @IsString()
  @ApiProperty()
  shippingGroupId: string;

  @IsNotEmpty()
  @IsString()
  @ApiProperty()
  choice: string;
}
