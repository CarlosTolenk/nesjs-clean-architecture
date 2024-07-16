import { Injectable } from '@nestjs/common';

// Domain
import { IUseCases } from '../../../shared/domain/UseCases';
import { PayloadSubstitutionMessage } from '../../domain/templates/payloads/PayloadSubstitutionMessage';
import { SendMessageRepository } from '../../domain/SendMessageRepository';
import { BodySubstitutionMessage } from '../../domain/templates/BodySubstitutionMessage';

// Infrastructure
import { ResponseSendMessageDto } from '../../infrastructure/http/dto/responseSendMessage.dto';
import { SendSubstitutionMessageDto } from '../../infrastructure/http/dto/sendSubstitutionMessage.dto';

@Injectable()
export class SendSubstitutionMessage
  implements IUseCases<SendSubstitutionMessageDto, ResponseSendMessageDto>
{
  constructor(private readonly sendMessageRepository: SendMessageRepository) {}
  async execute(
    params: SendSubstitutionMessageDto,
  ): Promise<ResponseSendMessageDto> {
    try {
      // TODO add business logic
      const body = this.generateBody(params);
      await this.sendMessageRepository.send(body);
      return ResponseSendMessageDto.OK();
    } catch (error) {
      throw error;
    }
  }

  private generateBody(
    params: SendSubstitutionMessageDto,
  ): BodySubstitutionMessage {
    const payload = new PayloadSubstitutionMessage();
    return new BodySubstitutionMessage({
      shippingGroupId: params.shippingGroupId,
      firstName: params.firstName,
      cellphone: params.cellphone,
      customerId: params.customerId,
      payload,
    });
  }
}
