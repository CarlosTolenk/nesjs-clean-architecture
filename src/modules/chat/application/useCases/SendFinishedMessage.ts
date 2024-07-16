import { Injectable } from '@nestjs/common';

// Domain
import { IUseCases } from '../../../shared/domain/UseCases';
import { BodyFinishedMessage } from '../../domain/templates/BodyFinishedMessage';
import { PayloadFinishedMessage } from '../../domain/templates/payloads/PayloadFinishedMessage';
import { SendMessageRepository } from '../../domain/SendMessageRepository';

// Infrastructure
import { ResponseSendMessageDto } from '../../infrastructure/http/dto/responseSendMessage.dto';
import { SendFinishedMessageDto } from '../../infrastructure/http/dto/sendFinishedMessageDto';

@Injectable()
export class SendFinishedMessage
  implements IUseCases<SendFinishedMessageDto, ResponseSendMessageDto>
{
  constructor(private readonly sendMessageRepository: SendMessageRepository) {}

  async execute(
    params: SendFinishedMessageDto,
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
  private generateBody(params: SendFinishedMessageDto): BodyFinishedMessage {
    const payload = new PayloadFinishedMessage();
    return new BodyFinishedMessage({
      shippingGroupId: params.shippingGroupId,
      firstName: params.firstName,
      cellphone: params.cellphone,
      customerId: params.customerId,
      payload,
    });
  }
}
