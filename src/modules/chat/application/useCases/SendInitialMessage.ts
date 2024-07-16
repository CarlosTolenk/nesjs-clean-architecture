import { HttpStatus, Injectable } from '@nestjs/common';

// Domain
import { BodyInitialMessage } from '../../domain/templates/BodyInitialMessage';
import { IUseCases } from '../../../shared/domain/UseCases';
import { PayloadInitialMessage } from '../../domain/templates/payloads/PayloadInitialMessage';
import { SendMessageRepository } from '../../domain/SendMessageRepository';
import { ChatRepository } from '../../domain/ChatRepository';
import { Chat, ChoiceAvailableType } from '../../domain/Chat';
import {
  ApplicationError,
  InfrastructureError,
  InvalidArgumentError,
} from '../../../shared/domain/exception';
import { ShippingGroupId } from '../../../shared/domain/valueObject/ShippingGroupId';
import { Cellphone } from '../../../shared/domain/valueObject/Cellphone';
import { CustomerId } from '../../../shared/domain/valueObject/CustomerId';

// Infrastructure
import { SendInitialMessageDto } from '../../infrastructure/http/dto/sendInitialMessage.dto';
import { ResponseSendMessageDto } from '../../infrastructure/http/dto/responseSendMessage.dto';

// Config
import { ConfigEnvService } from '../../../config/ConfigEnvService';
import { DomainError } from '../../../shared/domain/exception/DomainError';

@Injectable()
export class SendInitialMessage
  implements IUseCases<SendInitialMessageDto, ResponseSendMessageDto>
{
  constructor(
    private readonly sendMessageRepository: SendMessageRepository,
    private readonly configEnvService: ConfigEnvService,
    private readonly chatRepository: ChatRepository,
  ) {}

  async execute(
    params: SendInitialMessageDto,
  ): Promise<ResponseSendMessageDto> {
    try {
      await this.ensureThatMessageHasBeenSentPreviously(params.shippingGroupId);
      const bodyMessage = await this.sendMessage(params);
      const chat = this.createChatFromBodyMessage(
        bodyMessage,
        params.customerId,
      );
      await this.chatRepository.save(chat);
      return ResponseSendMessageDto.OK();
    } catch (error) {
      if (error instanceof DomainError) {
        throw error;
      }

      throw new ApplicationError(
        `[SG:${params.shippingGroupId}] Error trying to send initial message to customer`,
        HttpStatus.CONFLICT,
      );
    }
  }

  private async ensureThatMessageHasBeenSentPreviously(
    shippingGroupId: string,
  ): Promise<void> {
    const chat = await this.chatRepository.getByShippingGroup(shippingGroupId);

    if (chat) {
      throw new ApplicationError(
        `[SG:${shippingGroupId}] The initial message has already been sent to the client previously`,
        HttpStatus.OK,
      );
    }
  }

  private createChatFromBodyMessage(
    bodyMessage: BodyInitialMessage,
    customerId: string,
  ): Chat {
    const { shippingGroupId, sendingDate, customer } =
      bodyMessage.messagePlain();
    return new Chat({
      shippingGroupId: new ShippingGroupId(shippingGroupId),
      customerPhone: new Cellphone(customer.cellphone),
      customerId: new CustomerId(customerId),
      sendingDate: sendingDate,
      agreeExtraPaid: false,
      choice: ChoiceAvailableType.UNANSWERED,
    });
  }

  private async sendMessage(
    params: SendInitialMessageDto,
  ): Promise<BodyInitialMessage> {
    const body = this.generateBody(params);
    await this.sendMessageRepository.send(body);
    return body;
  }

  private generateBody(params: SendInitialMessageDto): BodyInitialMessage {
    const payload = this.generatePayload(params.firstName);
    return new BodyInitialMessage({
      shippingGroupId: params.shippingGroupId,
      firstName: params.firstName,
      cellphone: params.cellphone,
      customerId: params.customerId,
      payload,
    });
  }

  private generatePayload(firstName: string): PayloadInitialMessage {
    const { initialMessage } = this.configEnvService.getConfig().sendMessage;
    return new PayloadInitialMessage({
      customerFirstName: firstName,
      callOptionButton: initialMessage.callOptionButton,
      chooseForMeOptionButton: initialMessage.chooseForMeOptionButton,
      refundOptionButton: initialMessage.refundOptionButton,
    });
  }
}
