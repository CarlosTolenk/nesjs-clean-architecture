import { DataTransferObject } from '../../../../shared/domain/DataTransfer';
import { ApiProperty } from '@nestjs/swagger';

export class ResponseChatWithSubstitutionDto extends DataTransferObject {
  @ApiProperty()
  chat: ChatDto | null;

  @ApiProperty()
  substitution: SubstitutionDto | null;
}

interface ChatDto {
  id: string;
  shippingGroupId: string;
  choice: string;
  customerPhone: string;
  customerId: string;
  sendingDate: string;
  agreeExtraPaid: boolean;
}

interface SubstitutionDto {
  [sku: string]: SubstitutionDetail;
}

interface SubstitutionDetail {
  id: string;
  messageId: string;
  agree: string;
  descriptionOriginal: string;
  skuOriginal: string;
  chatId: string;
  prospect: Prospect[];
}

interface Prospect {
  id: string;
  description: string;
  sku: string;
  extraPaid: number;
  subsidy: number;
  substitutionId: string;
}
