import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsObject, IsString } from 'class-validator';

// Domain
import { DataTransferObject } from '../../../../shared/domain/DataTransfer';
import { EventTypes } from '../../../../shared/domain/EventTypes';

export class ButtonResponse {
  @IsNotEmpty()
  @IsString()
  payload: string;
}

export class EventRequestDto extends DataTransferObject {
  @IsNotEmpty()
  @IsString()
  @ApiProperty({
    example: `${EventTypes.LIDER_CALL_SOD_PICKING_SUBSTITUTION} | ${EventTypes.WSP_PICKING_SUBSTITUTION_PREFERENCES_V1} | ${EventTypes.WSP_PICKING_SUBSTITUTION_PROSPECT_APPROVAL}`,
  })
  event: string;

  @IsNotEmpty()
  @IsString()
  key: string;

  @IsNotEmpty()
  @IsString()
  key_complement: string;

  @IsNotEmpty()
  @IsString()
  message_id: string;

  @IsNotEmpty()
  @IsString()
  parent_message_id: string;

  @IsNotEmpty()
  @IsString()
  customer_id: string;

  @IsNotEmpty()
  @IsString()
  received_by_provider_at: string;

  @IsNotEmpty()
  @IsString()
  registered_by_contactability_at: string;

  @IsNotEmpty()
  @IsString()
  updated_at: string;

  @IsNotEmpty()
  @IsString()
  status: string;

  @IsObject()
  button_response: ButtonResponse;
}

export class EventPayload extends DataTransferObject {
  event: string;
  shippingGroupId: string;
  payload: string;

  constructor(params: EventRequestDto) {
    super();
    this.event = params.event;
    this.shippingGroupId = params.key;
    this.payload = params.button_response.payload;
  }
}
